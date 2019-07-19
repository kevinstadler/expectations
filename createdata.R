library(wpp2019)

if (file.exists("hld.RData")) {
  load("hld.RData")

} else {
  alldata <- read.csv("hld.csv")

  countries <- as.character(unique(alldata$Country))

  filtereddata <- lapply(countries, function(country) {
    data <- subset(alldata, Country == country)
    availableyears <- sort(unique(data$Year1), decreasing=TRUE)
    yearindex <- which.max(availableyears)
    data <- subset(data, Year1 == availableyears[yearindex])
    print(paste(country, availableyears[yearindex], data$Region[1], data$Residence[1], data$Ethnicity[1], data$SocDem[1], data$TypeLT[1]))
    subset(data, Region == data$Region[1] & Residence == data$Residence[1] & Ethnicity == data$Ethnicity[1] & SocDem == data$SocDem[1] & TypeLT == data$TypeLT[1])
  })

  maxage <- max(sapply(filtereddata, function(data) max(data$Age)))

  save(countries, filtereddata, maxage, file = "hld.RData")
}


intervalcenter <- function(start, int)
  ( start * 2 + int - 1 ) / 2

createdistribution <- function(intervals) {
  # first value
  if (intervals$AgeInt[1] == 1) {
    data <- intervals$d.x.[1]
  } else {
    # exponential decay down to the following interval's value
    # (scaled to achieve same probability mass)
    baselevel <- intervals$CenterVal[2]

    remainingmass <- intervals$d.x.[1] - intervals$AgeInt[1] * baselevel
    if (remainingmass < 0) {
      # FIXME e.g. Gambia data
      return(intervals$CenterVal[1])
    }

    # generate exponential decay
    nparts <- 2 ** intervals$AgeInt[1] - 1
    pperpart <- remainingmass / nparts
    data <- baselevel + pperpart * (2 ** (intervals$Age[2] - (0:(intervals$Age[2] - 1)) - 1))
    # set first interval centerval to same so that 2nd interval interpolation doesn't mess up
    intervals$CenterVal[1] <- baselevel
  }

  # center-to-center interpolation of all in-between intervals
  i <- 2 # index of the higher 
  while (length(data) <= intervals$Center[nrow(intervals) - 1]) {
    if (intervals$AgeInt[i] == 1) {
      data <- c(data, intervals$d.x.[i])
      i <- i + 1
    } else {
      data <- c(data, weighted.mean(intervals$CenterVal[c(i, i - 1)],
        abs(intervals$Center[c(i - 1, i)] - length(data))))
      if (length(data) >= intervals$Center[i]) {
        i <- i + 1
      }
    }
  }

  # last interval: exponential decay from below the previous interval's
  # value down to 0

  postcenteryears <- intervals$Age[nrow(intervals)] - length(data)
  prevcatremainingmass <- postcenteryears * intervals$CenterVal[nrow(intervals) - 1]
  totalmass <- prevcatremainingmass + intervals$d.x.[nrow(intervals)]

#  ref <- data[length(data)]
  ref <- 2*data[length(data)] - data[length(data)-1]

  cellstofill <- 2 + maxage - length(data)
  dv <- 1
  weights <- exp(-1/dv * 0:(cellstofill - 1))
  # subtract offset so that last cell is at 0
  weights <- weights - weights[cellstofill]
  while (totalmass / sum(weights) > ref && dv < 16) {
    dv <- dv + 1
    weights <- exp(-1/dv * 0:(cellstofill - 1))
    weights <- weights - weights[cellstofill]
    print(paste(maxage, length(data), cellstofill, totalmass, ref, dv, totalmass / sum(weights)))
  }

  # last cell is already 0, add another one just to flatten out
  c(data, totalmass * weights / sum(weights), 0)
}

calculatecountry <- function(data, malebyfemale = 1) {
  data$Center <- intervalcenter(data$Age, data$AgeInt)
  data$CenterVal <- data$d.x. / data$AgeInt
  table <- t(sapply(2:1, function(sex) { # women first!
    sexdata <- subset(data, Sex == sex)
    if (sum(sexdata$d.x.) != 100000) {
      print(paste("d.x. for sex", sex, "sums to", sum(sexdata$d.x.)))
    }
    createdistribution(sexdata)
  }))

  if (nrow(table) != 2) {
    return(NA)
  }
  # normalise so we get probabilities
  ss <- rowSums(table)
  print(ss)
  if (any(is.infinite(table)) || any(ss == 0)) {
    print("skipping")
    return(NA)
  }
  table <- table / ss

  genderweights <- c(1, malebyfemale) / (1 + malebyfemale)
  rbind(colSums(table * genderweights), table)
}

data(sexRatio)

distributions <- mapply(function(country, data) {
    print(country)
    malebyfemale <- sexRatio[match(sexRatio$country_code, countrycode::countrycode(country, 'iso3c', 'iso3n')), "2015-2020"]
    calculatecountry(data)
  }, countries, filtereddata)


validdistributions <- distributions[! is.na(distributions)]

writetable <- function(data, filename = "world")
  write.table(data, paste("public/data/", filename, ".csv" , sep=""), row.names=FALSE, col.names=FALSE)

dummy <- mapply(function(table, country) writetable(table, country), validdistributions, names(validdistributions))

countrydata <- data.frame(
  value=names(validdistributions),
  label=sapply(names(validdistributions), function(country) countrycode::countrycode(country, 'iso3c', 'country.name')))

countrydata <- countrydata[order(countrydata$label),]
json <- jsonlite::toJSON(countrydata)
write(json, file="public/countries.json")

# TODO filter CSK, SUN, YUG

data(popFT)
data(popMT)

codes <- countrycode::countrycode(names(validdistributions), 'iso3c', 'iso3n')
countryweights <- rbind(popFT[match(codes, popFT$country_code), "2015"], popMT[match(codes, popFT$country_code), "2015"])
countryweights <- rbind(countryweights, colSums(countryweights))
countryweights[is.na(countryweights)] <- 0

globaldata <- t(sapply(1:nrow(validdistributions[[1]]), function(row) {
  sapply(1:ncol(validdistributions[[1]]), function(col) {
    weighted.mean(sapply(validdistributions, function(country) country[row, col]), countryweights[row, ])
  })
}))

writetable(globaldata)
