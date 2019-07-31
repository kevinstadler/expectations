import React from 'react';

import { Button, Form, Input, Modal, Popover, PopoverBody, UncontrolledPopover } from 'reactstrap';

import Select from 'react-select'

import { VictoryArea, VictoryAxis, VictoryChart, VictoryLabel, VictoryLine, VictoryTooltip, VictoryVoronoiContainer} from 'victory';

// data:
// great quality (full tables) but only 40 countries: https://www.mortality.org/
// world bank csv, life expectancy at birth 1960-2016 as CSV: https://data.worldbank.org/indicator/sp.dyn.le00.in
// gapminder, life expectancy at birth 1800-2016/8 as CSV (full country name): https://www.gapminder.org/data/
// WHO life expectancy and life tables: http://apps.who.int/gho/data/node.main.686?lang=en
//  * life expectancy (by region and sex only): http://apps.who.int/gho/data/view.main.SDG2016LEXREGv?lang=en
//  * life tables (per country): http://apps.who.int/gho/data/node.main.LIFECOUNTRY?lang=en (get "CSV - table" file)
// UN life expectancy at birth 1950-2100 (per gender): http://data.un.org/Search.aspx?q=life+expectancy
// ourworldindata.org nice combination of UN above and Clio-Infra til 1949, but no gender: https://ourworldindata.org/grapher/life-expectancy (click 'data')
// clio-infra (life expectancy at birth by gender and country but only ever 10ish years): https://clio-infra.eu/Indicators/FemalelifeExpectancyatBirth.html
// under the assumption: http://www.lifeexpectancy.org/lifetable.shtml

const sexOptions = [ { value: 'F', label: 'female' }, { value: 'M', label: 'male' } ];

function formatAge(age) {
  return Math.round(10 * age) / 10;
}

function formatPercent(p) {
  var resolution = 10;
  if (p < .0001) {
    return "< 0.01%";
  } else if (p > .9999) {
    return "> 99.99%";
  } else if (p < .01 || p > .99) {
    resolution = 100;
  }
  return Math.round(100 * resolution * p) / resolution + "%";
}


class Expectations extends React.Component {
  constructor(props) {
    super(props);

    var age = localStorage.getItem('age');
    var sex = localStorage.getItem('sex');
    var country = localStorage.getItem('country');

    if (window.location.hash.length) {
      const args = window.location.hash.substring(1).split('/');
      if (args.length === 3) {
        age = args[0];
        sex = args[1];
        country = args[2];
      }
    }

    age = parseInt(age);

    this.state = {
      contactFormVisible: false,
      tableCache: {},
      age: isNaN(age) ? 25 : age,
      sex: sex || 0,
      country: country || 'world',
      showModal: window.location.hash.length === 0,
      // avoid errors on first render
      mean: 0,
      meanAtBirth: 0
    };
  }

  componentDidMount = () => {
    this.setCountry({ value: this.state.country });
  }

  updateDistribution = (stateUpdate) => {
    let updatedState = {...this.state, ...stateUpdate};
    var countryData = updatedState.tableCache[updatedState.country];
    const sexIndex = sexOptions.findIndex((el) => el.value === updatedState.sex) + 1 || 0;
    updatedState.sex = updatedState.sex ? sexOptions[updatedState] : '';
    var ps = countryData[sexIndex].slice();
    var meanAtBirth = formatAge(ps.map((p, i) => p * i).reduce((a, b) => a + b));

    // find last non-zero death probability
    ps.reverse();
    const maxAge = ps.length - 1 - ps.findIndex(v => v > 0)
    ps.reverse();

    var totalremainingdensity = ps.slice(updatedState.age).reduce((a, b) => a + b);

    if (totalremainingdensity == 0) {
      // limit age to highest category of distribution
      updatedState.age = maxAge;
      totalremainingdensity = ps.slice(updatedState.age).reduce((a, b) => a + b);
    }

    // weighted mean of years still to be lived
    var mean = ps.slice(updatedState.age).map((p, i) => p * (updatedState.age + i)).reduce((a, b) => a + b);
    mean = mean / totalremainingdensity;

    var impendingDeath = ps[updatedState.age];
    // find upcoming number of years until probability of death exceeds 1% (ish)
    for (var yearsToGo = 1; impendingDeath / totalremainingdensity < 0.008; yearsToGo++) {
      impendingDeath += ps[updatedState.age + yearsToGo];
    }
    // normalise
    impendingDeath = impendingDeath / totalremainingdensity;
    var factlet = '';
    if (yearsToGo === 1) {
      factlet = <span>a <strong>{formatPercent(impendingDeath)}</strong> chance that you will die <strong>within the next year</strong>.</span>;
    } else if (Math.abs(impendingDeath - 0.01) < .0025) {
      factlet = <span>a 1 in 100 chance that you will already die <strong>within the next {yearsToGo} years</strong> of your life!</span>;
    } else {
      factlet = <span>a <strong>{formatPercent(impendingDeath)}</strong> chance that you will already die within the next {yearsToGo} years of your life!</span>;
    }

    var description = "your demographic group";
    updatedState = {...updatedState, ...{
      distribution: ps,
      mean: mean,
      meanAtBirth: meanAtBirth,
      factlet: factlet,
      maxAge: maxAge,
      description: description,
      killedOff: ps.slice(0, updatedState.age).reduce((a, b) => a + b, 0) / ps.reduce((a, b) => a + b)
    }};

    this.setState(updatedState);
    window.location.hash = '#' + updatedState.age + '/' + (updatedState.sex || '') + '/' + updatedState.country;
  }

  setAge = (event) => {
    var age = event.value;
    this.updateDistribution({ 'age': age });
    localStorage.setItem('age', age);
  }

  setSex = (event) => {
    const sex = event ? event.value : '';
    this.updateDistribution({ 'sex': sex });
    localStorage.setItem('sex', sex);
  }

  setCountry = (event) => {
    const country = event ? event.value : "world";
    if (!this.state.tableCache[country]) {
      fetch('data/' + country + '.csv').then((response) => {
        if (response.ok && response.headers.get('Content-Type').startsWith('text/csv')) {
          return response.text();
        } else {
          console.log("Failed to fetch " + country);
          // TODO unset country
        }
      })
      .then((string) => {
        if (string) {
          var ps = string.split("\n").map((string) => string.split(' ').map(parseFloat));
          var cacheAddition = {};
          cacheAddition[country] = ps;
          this.updateDistribution({ country: country, tableCache: cacheAddition })
        }
      });
    } else {
      this.updateDistribution({ country: country });
    }
    localStorage.setItem('country', country);
  }

  hideModal = () => {
    this.setState({ showModal: false });
  }

  toggleContactForm = (e) => {
    if (e !== null) {
      e.preventDefault();
    }
    this.setState({ contactFormVisible: ! this.state.contactFormVisible });
  }

  render() {
    return (
      <div>
        <Modal className="firstvisit-dialog" isOpen={this.state.showModal}>
        <Skellie /><Skellie /><Skellie /><Skellie /><Skellie /><Skellie />
          <h2>how old are you?</h2>
          <AgeInput value={this.state.age} onChange={this.setAge} />
          <p className="mobile">NOTE: it looks like you are visiting this website on a touchscreen device. while the website is just as informative when viewed from a phone or tablet, you will find it a lot more entertaining to play with if you access it from a computer with a mouse or trackpad.</p>
          <Button color="secondary" onClick={this.hideModal}>I am prepared to look death in the eye</Button>
        </Modal>
        <div className="content">
          <header>
            <Skellie /><Skellie /><Skellie /><Skellie /><Skellie /><Skellie />
          </header>
          <p>
            <em>life expectancy</em> is a measure that is often used to capture the general health and wealth of a country or population group. but what does it mean for <em>you</em> that your average life expectancy is <strong>{formatAge(this.state.meanAtBirth)}</strong> years?
          </p>
          <h2>all is not so bad!</h2>
          <p>
            while your average life expectancy at birth was {formatAge(this.state.meanAtBirth)}, by managing to stay alive until the age of {this.state.age} you have already proven that you are not part of the <strong>{formatPercent(this.state.killedOff)}</strong> of people who die before they even make it to that age. well done!</p>
          <p>with the knowledge that you haven't died yet, we can re-calculate your individual life expectancy and find out that it is now actually higher than it was at your birth, namely <strong>{formatAge(this.state.mean)}</strong>&nbsp;years. what a treat.
          </p>
          <h2>all is not so good!</h2>
          <p>
            your new average life expectancy might sound pretty high to you, but there is of course no guarantee that you will live to exactly that age, or even anywhere near it. in reality life is much more like a <em>lottery</em>, where your own personal remaining life span will be randomly drawn from a statistical distribution of which the average life expectancy is just a <em>very crude</em> measure.</p>
          <p>so while it might be another {formatAge(this.state.mean - this.state.age)} years until you reach your average life expectancy, there is also {this.state.factlet}</p>
          <p>
            to get an even better grasp of how much you should really be fearing for your life and when, please consult the interactive distribution below, which you can even further tailor to your own personal demographic circumstances. enjoy!
          </p>
          <ExpectationsGraph currentAge={this.state.age} distribution={this.state.distribution} mean={this.state.mean} />
          <UncontrolledPopover trigger="focus" placement="top" target="infobutton">
            <PopoverBody>
              <p>because the quality and resolution of mortality data varies from country to country, you might see some things in this distribution which will not seem right to you. if there's weird abrupt jumps in the data, this is probably due to the low quality of the underlying data. you might also see unusually straight lines in the distributions: this is because many countries (particularly developing ones) only know the probability of death per 5 or even 15-year interval, so i've had to employ some (probability-preserving) smoothing to generate some rough approximations of the probable underlying distributions.</p>
              <p>the limitations on available countries and binary sex are also a result of the data collection by the <a href="https://www.who.int/gho/mortality_burden_disease/life_tables/life_tables/en/">WHO</a>, who all of the data shown here eventually goes back to.</p>
            </PopoverBody>
          </UncontrolledPopover>
          <h3>change demographic features <Button id="infobutton" color="secondary">?</Button></h3>

          <div className="parameters">
            <AgeInput value={this.state.age} maxAge={this.state.maxAge} onChange={this.setAge} />
            <label className="sex">
              <SexInput value={this.state.sex} onChange={this.setSex} />
            </label>
            <div className="country"><CountrySelect value={this.state.country} onChange={this.setCountry} /></div>
          </div>
          <footer>
            <p>built in 2019 by <a href="http://kevinstadler.github.io">Kevin Stadler</a>, data by the <a href="https://www.lifetable.de">human life table database</a>.</p>
            <Popover placement="top" target="contact" isOpen={this.state.contactFormVisible}>
              <PopoverBody>
                <Form>
                  <Input type="text" name="name" id="name" placeholder="name" />
                  <Input type="email" name="email" id="email" placeholder="e-mail" />
                  <Input type="textarea" name="text" id="contacttext" placeholder="your message" />
                  <Button disabled>under construction</Button>
                </Form>
              </PopoverBody>
            </Popover>

            <p>comments, questions, suggestions? <a href="https://kevinstadler.github.io/#contact" id="contact">contact me</a> before it's too late.</p>
            <p>realized you can't possibly spend all of your accumulated fortune in this lifetime? send me your money: <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2JE6FCBYY94LJ"><img src="https://img.shields.io/badge/💀%20%20💀%20%20💀-paypal%20($)-lightgray.svg" alt="give me your dollars" title="send me your money" /></a> <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=WKKFFM6D7ZHEE"><img src="https://img.shields.io/badge/💀%20%20💀%20%20💀-paypal%20(%E2%82%AC)-lightgray.svg" alt="give me your euros" title="send me your money" /></a></p></footer>
        </div>
      </div>
    );
  }
}

export default Expectations;

function AgeInput (props) {
  const options = Array.apply(null, { length: props.maxAge - 1 || 109 }).map(Number.call, Number).map(i => { return { value: i + 1, label: i + 1 }});
  return (<Select
    className="age"
    options={options}
    onChange={props.onChange}
    value={options[props.value - 1]}
    isClearable={false}
  />);
}

function SexInput (props) {
  return (<Select
    className="age"
    options={sexOptions}
    onChange={props.onChange}
    value={ sexOptions.find((el) => el.value === props.value) }
    placeholder="Select sex..."
    isClearable={true}
  />);
}

class CountrySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { countries: [] };
  }

  componentDidMount = () => {
      fetch("countries.json").then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Failed to fetch countries information");
        }
      }).then((json) => {
        this.setState({countries: json});
      }
    );
  }

  render() {
    return (<Select
      options={this.state.countries}
      onChange={this.props.onChange}
      value={this.state.countries.find((el) => el.value === this.props.value)}
      isClearable={true}
      placeholder="Select country..."
      />);
  }
}

class ExpectationsGraph extends React.Component {

  render() {
    if (!this.props.distribution) {
      return null;
    }

    var survivedData = this.props.distribution.slice(0, this.props.currentAge + 1).map((p, i) => { return { x: i, y: p }});
    const outlived = this.props.distribution.slice(0, this.props.currentAge).reduce((a, b) => a + b);

    var remaningData = this.props.distribution.slice(this.props.currentAge);
    var cumulative = remaningData.slice(1).reduce((cs, next) => { cs.push(cs[cs.length - 1] + next); return cs }, [ remaningData[0] ]);
    var total = cumulative[cumulative.length - 1];
    var deathData = remaningData.map((p, i) => { return { x: this.props.currentAge + i, y: p, c: cumulative[i] / total } });

    var meanP = this.props.distribution[Math.floor(this.props.mean)] +
      (this.props.mean % 1.0) *
      (this.props.distribution[Math.ceil(this.props.mean)] - this.props.distribution[Math.floor(this.props.mean)]);
    // generate lots of points along vertical line to improve voronoi
    var meanData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {return { x: this.props.mean, y: meanP * i/10 }});

    var labelComponent = (<VictoryTooltip
            dy={(datum) => datum.y }
            flyoutComponent={<LineFlyout />}
            labelComponent={<VictoryLabel style={{ fontSize: 11 }} />}
            flyoutStyle={{fill: "white"}} />);
    var deathStyle = { data: { stroke: "black", strokeWidth: 1, fill: "#eee" } };

    return (
      <VictoryChart
        minDomain={{ x: 0, y: 0 }}
        containerComponent={
          // use Voronoi Container to enable tooltip on line chart
          <VictoryVoronoiContainer
//            style={{  overflow: 'visible' }}}
            className="chart"
//            voronoiDimension="x"
            />
        }>
        <VictoryAxis
          label="age"
          style={{ axis: {strokeWidth: 0} }} />
        <VictoryAxis
          dependentAxis
          label="probability of dying at that age"
//          offsetX={50}
// TODO fix opacity
          style={{ axis: {stroke: "lightgray", strokeWidth: 1.5}, tickLabels: { fill: "none" } }} />

        <VictoryLine
          data={survivedData}
          style={{ data: { stroke: "darkgray", strokeWidth: 1 } }}
          labelComponent={<VictoryTooltip
            dy={(datum) => datum.y+10 }
            flyoutComponent={<LineFlyout />}
            style={{ fontSize: 11 }} />} // TODO set position
          labels={(datum) => "you didn't die when you were " + datum.x + ",\nunlike " + formatPercent(datum.y) + " of other people\nfrom your cohort. well done!"}
          />

        <VictoryArea
          data={deathData}
          style={deathStyle}
          labelComponent={labelComponent}
          labels={(datum) => "probability that you will\ndie before you turn " + (datum.x + 1) + ":\n" + formatPercent(datum.c) }
          />
        <VictoryLine
          data={[ {x: this.props.currentAge, y: 0 } , deathData[0]]}
          style={deathStyle}
          labelComponent={labelComponent} // TODO fix label position
          labels={() => "by surviving to the age of " + this.props.currentAge + ", you have outlived\n" + formatPercent(outlived) +  " of your cohort who are already dead.\nprobability that you will die this year: " + formatPercent(deathData[0].y)}
          />

        <VictoryLine
          data={meanData}
          style={{ data: { strokeWidth: 1, stroke: "red", fill: "#eee" } }}
          labelComponent={<VictoryTooltip style={{ fontSize: 11 }} />} // TODO set position
          labels={() => "average expected lifetime\nfor somebody aged " + this.props.currentAge + ":\n" + formatAge(this.props.mean) + " years"}
          />
      </VictoryChart>
      );
  }
}

class LineFlyout extends React.Component {
  render() {
    const {x, y} = this.props;
    // model after https://github.com/FormidableLabs/victory/blob/master/packages/victory-tooltip/src/flyout.js#L27
//    const {width, height} = this.props;
    const width = 220;
    const height = 50;
    return (
      <g>
        <rect x={x-0.5} y={y+10} width="1" height={Math.max(0, 250-y-10)} fill="black" />
        <circle cx={x} cy={y+10} r="2" fill="black"/>
        <rect x={x-width/2} y={y-45-height/2} width={width} height={height} stroke="black" fill="white" />
      </g>
    );
  }
}

class Skellie extends React.Component {
  constructor() {
    super();
    this.state = { dead: Math.random() >= 0.5 };
  }

  render() {
    return (<img className="skellie" alt="a graphic reminder of your mortality" title="what do you expect?" src={this.state.dead + ".png"} onClick={() => this.setState({ dead: !this.state.dead }) } />);
  }
}
