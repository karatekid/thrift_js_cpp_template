#include "utils.h"
#include "easylogging++.h"

void initializeLogging(int argc, char **argv) {
    START_EASYLOGGINGPP(argc, argv);
    el::Configurations conf(LOGGING_CONFIG);
    el::Loggers::reconfigureAllLoggers(conf);
    el::Loggers::configureFromGlobal(LOGGING_LVL_CONFIG);
}
