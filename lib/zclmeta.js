/* jshint node: true */
'use strict';

var fs = require('fs'),
    Enum = require('enum');

var zclMeta = JSON.parse(fs.readFileSync(__dirname + '/defs/zcl_meta.json')),
    zclDefs = require('./defs/zcl_defs.js');

var zclmeta = zclDefs;

zclmeta.foundation = {};
zclmeta.functional = {};

zclmeta.foundation.get = function (cmd) {
    var meta = zclMeta.foundation;
    return meta ? meta[cmd] : undefined;
};

zclmeta.foundation.getDirection = function (cmd) {
    var meta = this.get(cmd);
    if (meta)
        meta = zclmeta.Direction.get(meta.direction);

    return meta ? meta.key : undefined;        // return: "Client To Server", "Server To Client"
};

zclmeta.foundation.getParams = function (cmd) {
    var meta = this.get(cmd),
        params = meta ? meta.params : meta;    // [ { name: type }, .... ]

    if (params)
        return cloneParamsWithNewFormat(params);
    else
        return;
};

zclmeta.functional.get = function (cluster, cmd) {
    var meta = zclMeta.functional[cluster];
    return meta ? meta[cmd] : undefined;
    // return: {
    //  direction,
    //  cmdId,
    //  params: [ { name: type }, ... ]
    // }
};

zclmeta.functional.getDirection = function (cluster, cmd) {
    var meta = this.get(cluster, cmd);
    if (meta)
        meta = zclmeta.Direction.get(meta.direction);

    return meta ? meta.key : undefined;        // return: "Client To Server", "Server To Client"
};

zclmeta.functional.getParams = function (cluster, cmd) {
    var meta = this.get(cluster, cmd),
        params = meta ? meta.params : meta;    // [ { name: type }, .... ]

    if (params)
        return cloneParamsWithNewFormat(params);
    else
        return;
};

function cloneParamsWithNewFormat(params) {
    var output = [];

    params.forEach(function (item, idx) {
        var newItem = {
                name: Object.keys(item)[0],
                type: null
            };

        newItem.type = item[newItem.name];    // type is a number
        output.push(newItem);
    });

    output = paramTypeToString(output);

    return output;
}

function paramTypeToString(params) {
    // params.forEach(function (item, idx) {
    //     var type = zclmeta.ParamType.get(item.type);    // enum | undefined
    //     item.type = type ? type.key : item.type;        // item.type is a string
    // });

    return params;
}

module.exports = zclmeta;