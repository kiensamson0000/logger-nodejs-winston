const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const Utils = require('./utils');
const logLabel = 'KIEN_TEST_LOG';
require('winston-daily-rotate-file');


const logFormat = printf(function({ level, message, label, timestamp }){
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const infoLogTransport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: './logs/info',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '30d'
});

const exceptionLogTransport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: './logs/exceptions',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '30d'
});

const rejectionLogTransport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    dirname: './logs/rejections',
    datePattern: 'DD-MM-YYYY',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '30d'
});

const alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all:true
    }),
    winston.format.label({
        label: logLabel
    }),
    winston.format.timestamp({
        format: function(){
            return `[${Utils.number2DateString()}]`;
        }
    }),
    logFormat
);

const logger = createLogger({
    level: "debug",
    format: combine(
        label({ label: logLabel }),
        timestamp({
            format: function(){
                return `[${Utils.number2DateString()}]`;
            }
        }),
        logFormat,
        format.colorize(),
        alignColorsAndTime
    ),
    transports: [
        new transports.Console(),
        infoLogTransport
    ],
    exceptionHandlers: [
        exceptionLogTransport
    ],
    rejectionHandlers: [
        rejectionLogTransport
    ]
});

logger.exceptions.handle(
    exceptionLogTransport
);

logger.rejections.handle(
    rejectionLogTransport
);

module.exports = logger;
