const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const Utils = require('./utils');
const logLabel = 'KIEN_TEST_LOG';
require('winston-daily-rotate-file');

// thiết lập định dạng của log
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
    // thêm màu sắc
    winston.format.colorize({
        all:true
    }),
    winston.format.label({
        label: logLabel
    }),
    // Định dạng time cho log
    winston.format.timestamp({
        format: function(){
            return `[${Utils.number2DateString()}]`;
        }
    }),
    logFormat
);

const logger = createLogger({
    level: "debug",
    // format của log được kết hợp thông qua format.combine
    format: combine(
        label({ label: logLabel }),
        timestamp({
            format: function(){
                return `[${Utils.number2DateString()}]`;
            }
        }),
        logFormat,
        // thêm màu sắc
        format.colorize(),
        alignColorsAndTime
    ),
    transports: [
        // hiển thị log thông qua console
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
