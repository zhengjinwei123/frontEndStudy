// "use strict";
//
// var net = require('net');
// var Proto = require('../sockhandlers/proto');
//
// var settings = require('../settings');
// var log = require('./log')(settings.log);
// var accessLog = log({file:'access'})
//   , errorLog = log({file:'error'});
//
// var packetMark = 0xAAEE;
//
// function buildCheckSum(len){
// 	return (len ^ 0xBBCC) & 0x88AA;
// }
//
// function sendMsg(data, client){
// 	/*
// 	typedef struct tagGTMsgHeader
// 	{
// 		UINT16	wCheckSum;  //У����     (wDataLen ^ 0xBBCC) & 0x88AA;
// 		UINT16	wMark;      //��ͷ��ʾ
// 		UINT16	wDataLen;   //���ݰ�����
// 		UINT8	byFlags;			0
// 		UINT8	byOptLen;			0
// 	}SGTMsgHeader;
//
// 	typedef struct tagGSMsgHeader
// 	{
// 		UINT16  wMsgID; // Э��ID
// 		UINT32	dwTransID; // ����ID		0
// 	}SGSMsgHeader;
// 	*/
//
// 	var slen = Buffer.byteLength(data.msg);
// 	var datalen = 2+4 + 2+slen;
// 	var buf = new Buffer(2+2+2+1+1 + datalen);
//
// 	buf.writeUInt16BE(buildCheckSum(datalen), 0);		// checksum
// 	buf.writeUInt16BE(packetMark, 2);		// mark
// 	buf.writeUInt16BE(datalen, 4);		// datalen
// 	buf.writeUInt8(0, 6);		// flags
// 	buf.writeUInt8(0, 7);		// optlen
//
// 	buf.writeUInt16BE(data.msgid, 8);		// msgid
// 	buf.writeUInt32BE(0, 10);		// transid
//
// 	buf.writeUInt16BE(slen, 14);	// msg string len
// 	buf.write(data.msg, 16);		// msg
// 	client.write(buf);
// 	accessLog.info(null, "Socket Send:" + data.msg);
// }
//
// function createConnection(config){
//
// 	// �������
// 	function checkPacket(buffers, connection){
// 		if (buffers.length == 0){
// 			return false;
// 		}
// 		function mergeLeadingBuffersUntilLengthReach(n){
// 			var buf0 = buffers.shift();
// 			while(buf0.length < n){
// 				if (buffers.length == 0){
// 					buffers.unshift(buf0);
// 					return false;
// 				}
// 				var buf1 = buffers.shift();
// 				var buf0_1 = new Buffer(buf0.length + buf1.length);
// 				buf0.copy(buf0_1);
// 				buf1.copy(buf0_1, buf0.length);
// 				buf0 = buf0_1;
// 			}
// 			return buf0;
// 		}
//
// 		// merge leading buffers until it's length reach header length
// 		var headerLen = 2+2+2+1+1;
// 		var buf = mergeLeadingBuffersUntilLengthReach(headerLen);
// 		if (buf === false){
// 			return false;
// 		}
// 		var checksum = buf.readUInt16BE(0);
// 		var mark = buf.readUInt16BE(2);
// 		var datalen = buf.readUInt16BE(4);
// 		if (mark != packetMark){
// 			console.log('invalid mark! dropping data');
// 			return;
// 		}
// 		var expectedChecksum = buildCheckSum(datalen);
// 		if (checksum != expectedChecksum){
// 			console.log('invalid packet! dropping data', checksum, expectedChecksum);
// 			return;
// 		}
// 		buffers.unshift(buf);
//
// 		buf = mergeLeadingBuffersUntilLengthReach(headerLen + datalen);
// 		if (buf === false){
// 			return false;
// 		}
//
// 		var msgID = buf.readUInt16BE(8);
// 		var msgLen = buf.readUInt16BE(14);
// 		var msg = buf.toString("utf8", 16, 16+msgLen);
//
// 		if (buf.length > (headerLen + datalen)){
// 			buffers.unshift(buf.slice(headerLen + datalen));
// 		}
//
// 		// ��������Э���Լ��ص�����
// 		var func = Proto.gmResultParse[msgID];
// 		if(func != undefined && typeof func == 'function') {
// 			var result = func(msg);
//
// 			var callback = funcs[result.reqid];
// 			if(callback != undefined && typeof callback == 'function') {
// 				if(result.msg == 0) {
// 					callback(null, result);
// 				} else {
// 					callback(result.msg);
// 				}
// 				delete funcs[result.reqid];
// 			} else {
// 				accessLog.error(null, "callback error:" + msgID);
// 			}
// 		} else {
// 			accessLog.error(null, "msgID error:" + msgID);
// 		}
//
// 		accessLog.info(null, "Socket Receive:" + msg);
//
// 		checkPacket(buffers, connection);
// 		return true;
// 	}
//
// 	// socket
// 	var client;
// 	var host = config.host;
// 	var port = config.port;
// 	var buffers = [];
// 	var funcs = {};
// 	client = net.createConnection(port, host);
// 	client.uuid = 0;
// 	//client.setTimeout(config.socketTimeOut);
// 	client.on("connect",function(){
// 		accessLog.info(null, "Socket connected " + host + ':' + port + ' ');
// 	});
// 	client.on("data",function(buffer){
// 		//var s = data.toString('utf8',0,data.legnth);
// 		buffers.push(buffer);
// 		checkPacket(buffers, client);
// 	});
// 	client.on("end",function(){
// 		client.resume();
// 	});
// 	client.on("close",function(){
// 		buffers = null;
// 		funcs = null;
// 		client.destroy();
// 		delSocketObj(client.uuid)
// 		accessLog.info(null, "Socket closed");
// 	});
// 	client.on("timeout",function(){
// 		client.destroy();
// 		accessLog.info(null, "Socket timeout");
// 	});
// 	client.on('error', function(e){
// 		accessLog.error(null, 'Socket connect error '+ JSON.stringify(e));
// 	});
// 	client.sendmsg = function(reqid, data, callback){
// 		sendMsg(data, client);
// 		funcs[reqid] = callback;
// 	};
// 	return client;
// };
//
// var socketObjMap = {};
// function getSocketObj(config){
// 	if( socketObjMap[config.groupid] == undefined ) {
// 		socketObjMap[config.groupid] = {};
// 		socketObjMap[config.groupid].reqid = 0;
// 		socketObjMap[config.groupid].client = createConnection(config.game);
// 		socketObjMap[config.groupid].client.uuid = config.groupid;
// 		socketObjMap[config.groupid].client.setTimeout(30 * 60 * 1000);
// 	}
// 	return socketObjMap[config.groupid];
// }
//
// function delSocketObj(uuid){
// 	delete socketObjMap[uuid];
// }
//
// module.exports = getSocketObj;