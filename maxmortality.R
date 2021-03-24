maxsfromfile <- function(filename) {
  d <- read.table(filename)
  // tuple of max infant mortality, max post-infancy mortality
  return(c(max(d[,1]), max(d[,-1])))
}

mxs <- sapply(list.files('public/data', full.names=TRUE), maxsfromfile)
apply(mxs, 1, max)
// => 0.1479126 0.1011606

-> for identical axis scaling across all data, use an .11 probability density y axis cutoff!
