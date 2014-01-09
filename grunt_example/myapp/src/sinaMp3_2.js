define(function(require, exports, module) {;
	(function(m) {
		m.debugMode = false;
		m.BQQPlayer = null;
		m.MediaPlayer = null;
		m.VH5Player = null;
		m.VFlashPlayer = null;
		m.bUseBQQPlayer = true;
		m.idBAutoPlay = null;
		m.S_UNDEFINE = 0;
		m.S_STOP = 1;
		m.S_PAUSE = 2;
		m.S_PLAYING = 3;
		m.S_BUFFERING = 4;
		m.S_PLAYBEGIN = 5;
		m.S_PLAYEND = 6;
		m.S_FORWORD = 4;
		m.S_RESERVSE = 5;
		m.S_BUFFERING_WMP = 6;
		m.S_WAITING = 7;
		m.S_MEDIAEND = 8;
		m.S_TRANSITION = 9;
		m.S_READY = 10;
		m.S_RECONNECTION = 11;
		m.REP_PLAYURL_IP_ARRAY = ["121.14.73.62", "121.14.73.48", "58.60.9.178", "58.61.165.54"];
		m.REP_PLAYURL_PORT = 17785;
		m.timeIndex = ((new Date()).getTime() % 2);
		m.P2P_UDP_SVR_IP = ["58.61.166.180", "119.147.65.30"][m.timeIndex];
		m.P2P_TCP_SVR_IP = ["58.61.166.180", "119.147.65.30"][m.timeIndex];
		m.P2P_UDP_SVR_PORT = 8000;
		m.P2P_TCP_SVR_PORT = 433;
		m.P2P_STUN_SVR_IP = "stun-a1.qq.com";
		m.P2P_STUN_SVR_PORT = 8000;
		m.P2P_TORRENT_URL = "http://219.134.128.55/";
		m.P2P_CACHE_SPACE = 100;
		m.ACTIVE_INTERVAL = 120;
		m.REP_SONGLIST_PORT = 8000;
		m.REP_SONGLIST_IP_ARRAY = ["121.14.94.181", "121.14.94.183"];
		m.REP_SONGLIST_PROGRAM = "QZoneWebClient";
		m.REP_PLAYSONG_IP_ARRAY = ["58.60.11.85", "121.14.96.113", "121.14.73.198", "121.14.95.82"];
		m.REP_PLAYSONG_PORT = 8000;
		m.STAT_REPORT_SVR_IP = "219.134.128.41";
		m.STAT_REPORT_SVR_PORT = 17653;
		m.MUSIC_COOKIE_DOMAIN = "qq.com";
		m.PANEL_UIN_COOKIE_NAME = "zzpaneluin";
		m.PANEL_KEY_COOKIE_NAME = "zzpanelkey";
		m.MUSIC_UIN_COOKIE_NAME = "qqmusic_uin";
		m.MUSIC_KEY_COOKIE_NAME = "qqmusic_key";
		m.MAX_PLAYLIST_NUM = 200;
		m.bqqplayer_play_flag = true;
	})(window.MP);
	MP.webPlayer = {};
	MP.webPlayer.playerList = function() {
		var mPostion = -1;
		var mMode = 1;
		var mpList = [];

		function getCount() {
			return mpList.length;
		}

		function lastPostion() {
			mPostion = (mPostion - 1 + mpList.length) % mpList.length;
			return mPostion;
		}

		function nextPostion() {
			if (mMode == 4) {
				var rnd = parseInt(Math.random() * 100000) % getCount();
				if (rnd == mPostion) {
					rnd = (rnd + 1) % getCount();
				}
				mPostion = rnd;
			} else {
				mPostion = (mPostion + 1) % getCount();
			}
			return mPostion;
		}

		function autoNextPostion() {
			if (mMode == 1) {
				if (mPostion < 0 || mPostion >= getCount()) {
					mPostion = 0;
				}
			} else if (mMode == 2) {
				if (isLastPlayer()) {
					return false;
				}
				mPostion = (mPostion + 1) % getCount();
			} else if (mMode == 3) {
				mPostion = (mPostion + 1) % getCount();
			} else if (mMode == 4) {
				var rnd = parseInt(Math.random() * 100000) % getCount();
				if (rnd == mPostion) {
					rnd = (rnd + 1) % getCount();
				}
				mPostion = rnd;
			}
			return true;
		}

		function setMode(mode) {
			if (mode < 1 || mode > 5) {
				mode = 1;
			}
			mMode = mode;
		}

		function setPostion(pos) {
			if (pos >= 0 && pos < mpList.length) {
				mPostion = pos;
			}
		}

		function getPostion() {
			return mPostion;
		}

		function isLastPlayer() {
			return (mPostion + 1) == mpList.length;
		}

		function getSongInfoObj() {
			return mpList[mPostion < 0 ? 0 : mPostion];
		}

		function setPlayerList(arr, mode) {
			if (typeof arr != "object") {
				return false;
			}
			clearPlayerList();
			for (var i = 0, len = arr.length; i < len; i++) {
				if (typeof arr[i] == "object") {
					mpList.push(arr[i]);
				}
			}
			mPostion = -1;
			if (typeof mode == 'undefined') {
				setMode(2);
			} else {
				setMode(mode);
			}
		}

		function addSongList(list) {
			for (var i = 0, len = list.length; i < len; i++) {
				if (typeof list[i] == "object") {
					mpList.push(list[i]);
				}
			}
		}

		function delSong(pos) {
			if (pos >= 0 && pos < mpList.length) {
				mpList.splice(pos, 1);
			}
			if (pos < mPostion) {
				mPostion--;
			}
			if (mPostion >= mpList.length) {
				mPostion = mpList.length - 1;
			}
			if (mpList.length == 0) {
				mPostion = -1;
			}
		}

		function clearPlayerList() {
			for (var i = 0, len = mpList.length; i < len; i++) {
				delete mpList[i];
			}
			mpList = [];
			mPostion = -1;
		}
		return {
			getCount: getCount,
			isLastPlayer: isLastPlayer,
			lastPostion: lastPostion,
			nextPostion: nextPostion,
			autoNextPostion: autoNextPostion,
			setPostion: setPostion,
			getPostion: getPostion,
			getSongInfoObj: getSongInfoObj,
			setPlayerList: setPlayerList,
			addSongList: addSongList,
			delSong: delSong,
			clearPlayerList: clearPlayerList,
			setMode: setMode
		};
	};
	MP.webPlayer.playStatus = {
		S_UNDEFINE: 0,
		S_STOP: 1,
		S_PAUSE: 2,
		S_PLAYING: 3,
		S_BUFFERING: 4,
		S_PLAYBEGIN: 5,
		S_PLAYEND: 6
	};
	MP.webPlayer.interFace = (function() {
		var VQQPlayer = null;
		var MediaPlayer = null;
		var VH5Player = null;
		var webPlayer = null;
		var playerList = null;
		var musicInitReady = false;
		var songDuration = 0;
		var curPostion = 0;
		var mIsLoop = false;
		var mIsH5Mp3 = true;
		var mPlayerType = 0;
		var mOption = {
			fromtag: 28,
			statFromtag: 0,
			errorTips: function(title, text) {
				alert(title + "</br>" + text);
			}
		};
		var wmaurl_tpl = 'http://stream%(stream).qqmusic.qq.com/%(sid).mp3';
		var wmaurl_tpl2 = 'http://stream%(stream).qqmusic.qq.com/%(sid).wma';
		var mp3url_tpl = 'http://stream%(stream).qqmusic.qq.com/%(sid).mp3';
		var tpturl_tpl = 'http://tpt.music.qq.com/%(sid).tpt';
		var songInfoObj = {
			mstream: 0,
			murl: '',
			msong: '',
			msinger: '',
			mQzoneKey: '',
			mid: 0,
			mSongType: 0
		};

		function init(opt) {
			MP.object.extend(mOption, opt || {});
		}

		function getOption() {
			return mOption;
		}

		function setCurPostion(cp, duration) {
			curPostion = cp;
			songDuration = duration;
		}

		function getCurPostion() {
			return curPostion;
		}

		function getPostion() {
			return playerList.getPostion();
		}

		function setSongInfoObj(obj) {
			MP.object.extend(songInfoObj, obj || {});
		}

		function getSongInfoObj() {
			return songInfoObj;
		}

		function initMusic(callback) {
			MP.initMusic(callback);
		}

		function OnSongPlayBegin(songinfo, index, total) {}

		function OnSongPlayEnd(songinfo, index, total) {}

		function OnSongPlaying(lCurPos, lTotal) {}

		function OnPlayPause() {}

		function OnPlayStop() {}

		function OnPlaying() {}

		function OnPlayError(_obj, index) {
			try {
				if ( !! _obj.mid && !! _obj.mstream && _obj.mid > 0 && _obj.mstream > 0) {} else {
					MP.console.print('歌曲播放失败！', '您添加的网络歌曲，地址出错或被主人删除。');
				}
			} catch (e) {}
		}

		function runPlayerForce(pos) {
			MP.pauseAppMusic();
			webPlayer = MP.getPlayer();
			if ( !! webPlayer) {
				webPlayer.runPlayerForce(pos);
			}
		}

		function startPlayer() {
			MP.pauseAppMusic();
			webPlayer = MP.getPlayer();
			if ( !! webPlayer) {
				webPlayer.bereload = false;
				webPlayer.startPlayer();
			}
		}

		function pausePlayer() {
			webPlayer = MP.getPlayer(); !! webPlayer && webPlayer.pausePlayer();
			g_webPlayer.OnPlayPause();
		}

		function pausePlayerFromApp() {
			MP.pauseFromApp = true;
			pausePlayer();
			if ( !! MP.BQQPlayer) {
				MP.resetProgress();
			}
		}

		function stopPlayer() {
			webPlayer = MP.getPlayer(); !! webPlayer && webPlayer.stopPlayer();
		}

		function lastPlayer() {
			if (!playerList || playerList.getCount() <= 0) {
				return false;
			}
			playerList.lastPostion();
			playList();
			return true;
		}

		function nextPlayer() {
			if (!playerList || playerList.getCount() <= 0) {
				return false;
			}
			g_webPlayer.OnSongPlayEnd(getSongInfoObj(), playerList.getPostion(), playerList.getCount());
			playerList.nextPostion();
			playList();
			try {} catch (e) {}
			return true;
		}

		function autoNextPlayer() {
			try {
				if (!playerList || playerList.getCount() <= 0) {
					return false;
				}
				g_webPlayer.OnSongPlayEnd(getSongInfoObj(), playerList.getPostion(), playerList.getCount());
				if (playerList.autoNextPostion()) {
					playList();
				} else {
					stopPlayer();
				}
			} catch (e) {}
			return true;
		}

		function playAnyPos(pos) {
			if (!playerList || playerList.getCount() <= 0) {
				return false;
			}
			playerList.setPostion(pos);
			playList();
			return true;
		}

		function addSong(list, isPlay) {
			var pos = playerList.getCount();
			playerList.addSongList(list);
			if (isPlay) {
				playerList.setPostion(pos);
				playList();
			}
		}

		function delSong(pos) {
			var curPos = playerList.getPostion();
			playerList.delSong(pos);
			if (pos == curPos) {
				if (playerList.getCount() <= 0) {
					stopPlayer();
					return false;
				}
				if (curPos >= (playerList.getCount() - 1)) {
					playerList.setPostion(playerList.getCount() - 1);
				}
				playList();
			}
			return true;
		}

		function mutePlayer() {
			webPlayer = MP.getPlayer(); !! webPlayer && webPlayer.setMute();
		}

		function getVolumn() {
			webPlayer = MP.getPlayer();
			if (!webPlayer) {
				return 0;
			}
			return webPlayer.getVolumn();
		}

		function setVolumn(vol) {
			webPlayer = MP.getPlayer(); !! webPlayer && webPlayer.setVolumn(vol);
		}

		function setPlayerState(status) {
			webPlayer = MP.getPlayer(); !! webPlayer && webPlayer.setPlayerState(status);
		}

		function setPlayURL() {
			var _obj = g_webPlayer.getSongInfoObj();
			var playUrl = g_webPlayer.getSongUrl(_obj);
			if (playUrl == '') {
				alert('歌曲链接错误！');
				return;
			}
			var sid = _obj.mid;
			if ( !! _obj.mid) {}
			var stype = MP.tj2rp.getSongType(playUrl);
			if (stype == 1 || stype == 5) {
				sid = 0;
			}
			if (playUrl == 5) {
				MP.BplaySong_local(_obj.msong, playUrl, sid, _obj.msinger, _obj.mid, stype);
			} else {
				MP.BplaySong(_obj.msong, playUrl, sid, _obj.msinger, _obj.mid, stype);
			}
			return;
		}

		function playSong(obj) {
			if (typeof obj != "object") {
				mOption.errorTips('歌曲信息错误！', "");
				return;
			}
			if (!obj.mstream || !obj.mid) {
				mOption.errorTips('歌曲信息错误！', "");
				return;
			}
			setSongInfoObj(obj);
			initMusic(function() {
				setPlayURL();
			});
		}

		function setPlayerList(isPlay, arr, mode) { !! playerList || (playerList = g_playerList());
			playerList.setPlayerList(arr, mode);
			if (isPlay) {
				nextPlayer();
			}
		}

		function getPlayerList(isPlay, arr, mode) { !! playerList || (playerList = g_playerList());
			return playerList;
		}

		function setMode(mode) {
			if (!playerList) {
				return false;
			}
			playerList.setMode(mode);
			return true;
		}

		function playList() { !! playerList || (playerList = g_playerList());
			setSongInfoObj(playerList.getSongInfoObj());
			playBegin();
			if (!( !! ua.isiPad || !! ua.isiPhone)) {
				setTimeout(function() {
					initMusic(function() {
						setPlayURL();
					});
				}, 0);
			} else {
				initMusic(function() {
					setPlayURL();
				});
			}
		}

		function playBegin() {
			if (!playerList) {
				return;
			}
			g_webPlayer.OnSongPlayBegin(getSongInfoObj(), playerList.getPostion(), playerList.getCount());
		}

		function getPlayerSource() {
			if ( !! MP.BQQPlayer) {
				return MP.BQQPlayer.getPlayerSource();
			}
		}

		function getCurrentPlayerSource() {
			if ( !! MP.BQQPlayer) {
				return MP.BQQPlayer.getCurrentPlayerSource();
			}
		}

		function setCurrentPlayerSource(args) { !! MP.BQQPlayer && MP.BQQPlayer.setCurrentPlayerSource(args);
		}

		function clearPlayerList() {
			if (!playerList) {
				return;
			}
			playerList.clearPlayerList();
			stopPlayer();
		}

		function getSongUrl(songobj) {
			var url = '';
			if ( !! songobj.mid && !! songobj.mstream && songobj.mid > 0 && songobj.mstream > 0) {
				var sid = parseInt(songobj.mid) + 30000000;
				url = wmaurl_tpl.jstpl_format({
					stream: parseInt(songobj.mstream) + 10,
					sid: sid
				});
			} else if ( !! songobj.msongurl) {
				url = songobj.msongurl;
			}
			return url;
		}

		function getTptUrl(songobj) {
			var url = '';
			if ( !! songobj.mid && !! songobj.mstream && songobj.mid > 0 && songobj.mstream > 0) {
				var sid = parseInt(songobj.mid) + 30000000;
				url = tpturl_tpl.jstpl_format({
					sid: sid
				});
			}
			return url;
		}

		function isSupportMp3() {
			return mIsH5Mp3;
		}

		function getPlayerType() {
			return mPlayerType;
		}
		return {
			wmaurl_tpl: wmaurl_tpl,
			wmaurl_tpl2: wmaurl_tpl2,
			mp3url_tpl: mp3url_tpl,
			tpturl_tpl: tpturl_tpl,
			setSongInfoObj: setSongInfoObj,
			getSongInfoObj: getSongInfoObj,
			initMusic: initMusic,
			runPlayerForce: runPlayerForce,
			startPlayer: startPlayer,
			pausePlayer: pausePlayer,
			pausePlayerFromApp: pausePlayerFromApp,
			stopPlayer: stopPlayer,
			lastPlayer: lastPlayer,
			nextPlayer: nextPlayer,
			autoNextPlayer: autoNextPlayer,
			playAnyPos: playAnyPos,
			addSong: addSong,
			delSong: delSong,
			mutePlayer: mutePlayer,
			getVolumn: getVolumn,
			setVolumn: setVolumn,
			playSong: playSong,
			setPlayerState: setPlayerState,
			setCurPostion: setCurPostion,
			getCurPostion: getCurPostion,
			getPostion: getPostion,
			setPlayerList: setPlayerList,
			getPlayerList: getPlayerList,
			playList: playList,
			OnSongPlayBegin: OnSongPlayBegin,
			OnSongPlayEnd: OnSongPlayEnd,
			OnSongPlaying: OnSongPlaying,
			OnPlayPause: OnPlayPause,
			OnPlayStop: OnPlayStop,
			OnPlayError: OnPlayError,
			playBegin: playBegin,
			OnPlaying: OnPlaying,
			getPlayerSource: getPlayerSource,
			getCurrentPlayerSource: getCurrentPlayerSource,
			setCurrentPlayerSource: setCurrentPlayerSource,
			setMode: setMode,
			clearPlayerList: clearPlayerList,
			getSongUrl: getSongUrl,
			getTptUrl: getTptUrl,
			isSupportMp3: isSupportMp3,
			getPlayerType: getPlayerType,
			init: init,
			getOption: getOption,
			setPlayURL: setPlayURL
		}
	})();
	MP.webPlayer.eventCallback = (function() {
		var $T = top;

		function OnInitialized(bSucc) {
			if (bSucc) {
				MP.event.on(window, "unload", function() {
					var mp = MP.BQQPlayer;
					if ( !! mp) {
						if (MP.cookie.get("radio").split("|")[0] == MP.user.getLoginUin() && MP.compareVer(mp.plv, "8.5.2011.228") >= 0) {
							mp.mPlayerName.SetRef(20000);
						} else {
							mp.unInitialize();
						}
					}
				});
			} else {
				MP.console.print("webPlayer initialize faied");
			}
		}

		function OnUnitialized() {}

		function OnStateChanged(lNewState) {
			if (lNewState >= 0 && lNewState <= 6) {
				g_webPlayer.setPlayerState(lNewState);
			}
			switch (lNewState) {
				case 0:
					g_webPlayer.setPlayerState(g_playerStatus.S_UNDEFINE);
					break;
				case 1:
					g_webPlayer.setPlayerState(g_playerStatus.S_STOP);
					g_webPlayer.OnPlayStop();
					break;
				case 2:
					g_webPlayer.setPlayerState(g_playerStatus.S_PAUSE);
					g_webPlayer.OnPlayPause();
					break;
				case 3:
					g_webPlayer.setPlayerState(g_playerStatus.S_PLAYING);
					g_webPlayer.OnPlaying();
					break;
				case 4:
					g_webPlayer.setPlayerState(g_playerStatus.S_BUFFERING);
					break;
				case 5:
					g_webPlayer.setPlayerState(g_playerStatus.S_PLAYBEGIN);
					break;
				case 6:
					try {
						g_webPlayer.setPlayerState(g_playerStatus.S_PLAYEND);
						g_webPlayer.autoNextPlayer();
					} catch (e) {
						MP.console.print("OnStateChanged case 6 exp:", e.message);
					}
					break;
				default:
					break;
			}
		}

		function OnPlayProgress(lCurPos, lTotal) {
			try {
				lCurPos = parseInt(lCurPos);
				lTotal = parseInt(lTotal);
				g_webPlayer.setCurPostion(lCurPos, lTotal);
				MP.getPlayer().mCurPlayPos = lCurPos;
				MP.g_songPlayLen = lTotal;
				g_webPlayer.OnSongPlaying(lCurPos, lTotal);
			} catch (e) {
				MP.console.print("onPlayProgress,exp:", e.message);
			}
		}

		function OnDownloadProgress(lCurPos, lProgress) {}

		function OnPlayError(lErrCode, sErrDesc) {
			try {
				var _obj = g_webPlayer.getSongInfoObj();
				var index = g_webPlayer.getPostion();
				g_webPlayer.OnPlayError(_obj, index);
			} catch (e) {}
			MP.console.print("playError,ErrCode:", lErrCode, "ErrDesc:", sErrDesc);
		}

		function OnPlaySrcChanged(sNewPlaySrc, sOldPlaySrc) {
			g_webPlayer.setCurrentPlayerSource(sNewPlaySrc);
			if (g_webPlayer.getCurrentPlayerSource() != g_webPlayer.getPlayerSource()) {
				g_webPlayer.setPlayerState(g_playerStatus.S_PAUSE);
				g_webPlayer.OnPlayPause();
			}
		}
		return {
			OnInitialized: OnInitialized,
			OnUnitialized: OnUnitialized,
			OnStateChanged: OnStateChanged,
			OnPlayProgress: OnPlayProgress,
			OnDownloadProgress: OnDownloadProgress,
			OnPlayError: OnPlayError,
			OnPlaySrcChanged: OnPlaySrcChanged
		};
	})();
	MP.webPlayer.stat = (function() {
		function add(songobj) {}
		return {
			add: add
		};
	})();
	window.g_player = MP.webPlayer;
	window.g_webPlayer = g_player.interFace;
	window.g_playerList = g_player.playerList;
	window.g_playerCallback = g_player.eventCallback;
	window.g_playerStatus = g_player.playStatus;
	window.g_playerStat = g_player.stat;
	MP.PlayListObject = function() {
		this.mId = -1;
		this.mSongId = 0;
		this.mSongType = 0;
		this.mSongUrl = "";
		this.mDuration = 0;
		this.mPlayURL = "";
		this.mTorrentURL = "";
		this.mSongName = "";
		this.mSingerName = "";
		this.mExpire = 0;
	};
	MP.PlayerListManager = function() {
		this.mFull = false;
		this.mPosition = -1;
		this.mpList = new Array();
		this.getCount = function() {
			return this.mpList.length;
		};
		this.getObject = function(n) {
			return this.mpList[n];
		};
		this.getPos = function(sul) {
			for (var i = 0, l = this.getCount(); i < l; i++) {
				if (this.getObject(i).mPlayURL == sul) {
					return i;
				}
			}
			return -1;
		};
		this.getPosById = function(Id) {
			for (var i = 0, l = this.getCount(); i < l; i++) {
				if (this.getObject(i).mId == Id) {
					return i;
				}
			}
			return -1;
		};
		this.findObjectById = function(id) {
			var i = this.getPosById(id);
			return (i != -1 ? this.getObject(i) : null);
		};
		this.findObject = function(sul) {
			var i = this.getPos(sul);
			return (i != -1 ? this.getObject(i) : null);
		};
		this.addObject = function(id, sul, stpt, iDuration, sSong, sSinger, sQzKey, iSongId, iSongType) {
			if (sul == "") {
				return;
			}
			var obj, pos;
			if (id > 0) {
				pos = this.getPosById(id);
			} else if (sul != "") {
				pos = this.getPos(sul);
			}
			if (pos == -1) {
				if (this.getCount() >= MP.MAX_PLAYLIST_NUM) {
					this.mFull = true;
					this.mPosition += 1;
					if (this.mPosition >= MP.MAX_PLAYLIST_NUM) {
						this.mPosition = 0;
					}
					obj = this.getObject(this.mPosition);
				} else {
					obj = {};
					this.mpList[this.getCount()] = obj;
				}
				obj.mId = id;
				obj.mPlayURL = sul;
				obj.mTorrentURL = stpt;
				obj.mDuration = iDuration;
				obj.mSongName = sSong;
				obj.mSingerName = sSinger;
				obj.mQzoneKey = sQzKey;
				obj.mSongId = (iSongId || 0);
				obj.mSongType = (iSongType || 0);
				obj.mSongUrl = sul;
				obj.mExpire = 0;
				this.saveToLocal();
			}
			return;
		};
		this.saveToLocal = function() {
			if (g_storage) {
				(function(_mplist) {
					!MUSIC.widget.Storage && (MUSIC.widget.Storage = MP.Storage);
					var key = "mplist" + MP.user.getLoginUin();
					g_storage.get(key, function(data) { !! data && g_storage.remove(key);
						g_storage.set(key, MP.lang.obj2str(_mplist));
					});
				})(this.mpList);
			}
		};
		this.clearObject = function() {
			for (var i = 0, l = this.getCount(); i < l; i++) {
				delete this.mpList[i];
			}
			this.mpList.length = 0;
		};
	};
	MP.insertBQQPlayer = function(args) {
		if ( !! ua.ie) {
			params = {};
			objAttrs = {};
			for (var k in args) {
				switch (k) {
					case "classid":
						continue;
						break;
					case "style":
					case "name":
					case "height":
					case "width":
					case "id":
						objAttrs[k] = args[k];
						break;
					default:
						params[k] = args[k];
				}
			}
			objAttrs["classid"] = "CLSID:E05BC2A3-9A46-4A32-80C9-023A473F5B23";
			var str = [];
			str.push('<object ');
			for (var i in objAttrs) {
				str.push(i);
				str.push('="');
				str.push(objAttrs[i]);
				str.push('" ');
			}
			str.push('>');
			for (var i in params) {
				str.push('<param name="');
				str.push(i);
				str.push('" value="');
				str.push(params[i]);
				str.push('" /> ');
			}
			str.push('</object>');
			MP.g_playerDiv = MP.getElementInBody("musicblog_mp", "div");
			MP.g_playerDiv.style.cssText = "height:0px;overflow:hidden";
			MP.g_playerDiv.innerHTML = str.join("");
			return MP.g_playerDiv.firstChild;
		} else {
			try {
				MP.g_playerDiv = MP.getElementInBody("musicblog_mp", "div");
				MP.g_playerDiv.style.cssText = "height:0px;overflow:hidden";
				MP.g_playerDiv.innerHTML = '<embed id="QzoneMusicMP" type="application/tecent-qzonemusic-plugin" width="0px" height="0px" />';
				var QzonePlayer = document.getElementById('QzoneMusic');
				var qmpVer = QzonePlayer.GetVersion(4);
				if (!(qmpVer >= "7.69")) {
					MP.isNeedUpdatePlayer = true;
					return false;
				}
				QzonePlayer.CreateAX("QzoneMusic.dll");
				for (var k in args) {
					switch (k) {
						case "classid":
						case "style":
						case "name":
						case "height":
						case "width":
						case "id":
						case "UsedWhirl":
							continue;
							break;
						default:
							QzonePlayer.setAttribute(k, args[k]);
					}
				}
				var QzoneMusicVer = QzonePlayer.GetVersion(5);
				if (QzoneMusicVer >= "3.2") {
					MP.P2P_UDP_SVR_IP = "pdlmusic.p2p.qq.com";
					MP.P2P_TCP_SVR_IP = "pdlmusic.p2p.qq.com";
				}
				QzonePlayer.setAttribute("P2PUDPServ_IP", MP.P2P_UDP_SVR_IP);
				QzonePlayer.setAttribute("P2PTCPServ_IP", MP.P2P_TCP_SVR_IP);
				try {
					QzonePlayer.UsedWhirl = "0";
				} catch (e) {}
				MP.bUseBQQPlayer = true;
				return QzonePlayer;
			} catch (e) {}
		}
	}
	MP.createBPlayer = function() {
		var ttii = (parseInt(Math.random() * 1000)) % MP.REP_PLAYSONG_IP_ARRAY.length;
		var ttii2 = (parseInt(Math.random() * 1000)) % MP.REP_SONGLIST_IP_ARRAY.length;
		var ttii3 = (parseInt(Math.random() * 1000)) % MP.REP_PLAYURL_IP_ARRAY.length;
		return MP.insertBQQPlayer({
			id: 'QzonePlayerMP',
			height: 0,
			width: 0,
			PlayerType: 2,
			CacheSize: MP.P2P_CACHE_SPACE,
			ValidDomain: 'qq.com',
			EnableSyncListen: 1,
			UploadStatCount: 10,
			ExitDelayTime: 5,
			UsedWhirl: 0,
			RestrictHttpStartInterval: 1,
			RestrictHttpStopInterval: 100,
			P2PUDPServ_IP: MP.P2P_UDP_SVR_IP,
			P2PUDPServ_Port: MP.P2P_UDP_SVR_PORT,
			P2PTCPServ_IP: MP.P2P_TCP_SVR_IP,
			P2PTCPServ_Port: MP.P2P_TCP_SVR_PORT,
			P2PStunServ_IP: MP.P2P_STUN_SVR_IP,
			P2PStunServ_Port: MP.P2P_STUN_SVR_PORT,
			RepPlaySong_IP: MP.REP_PLAYSONG_IP_ARRAY[ttii],
			RepPlaySong_Port: MP.REP_PLAYSONG_PORT,
			RepSongList_IP: MP.REP_SONGLIST_IP_ARRAY[ttii2],
			RepSongList_Port: MP.REP_SONGLIST_PORT,
			RepPlayURL_IP: MP.REP_PLAYURL_IP_ARRAY[ttii3],
			RepPlayURL_Port: MP.REP_PLAYURL_PORT
		});
	}
	MP.EventPlayer = function(oTarget, sEventType, fnHandler) {
		if (oTarget.attachEvent) {
			oTarget.attachEvent(sEventType, fnHandler);
		} else if (oTarget.addEventListener) {
			oTarget.addEventListener(sEventType, fnHandler, false);
		} else {
			oTarget[sEventType] = fnHandler;
		}
	}
	MP.EventPlayerRemove = function(oTarget, sEventType, fnHandler) {
		if (oTarget.detachEvent) {
			oTarget.detachEvent(sEventType, fnHandler);
		} else if (oTarget.removeEventListener) {
			oTarget.removeEventListener(sEventType, fnHandler, false);
		} else {
			oTarget[sEventType] = null;
		}
	}
	MP.BlogQQPlayer = function() {
		this.mPlayList = new MP.PlayerListManager();
		this.mPlayingPos = -1;
		this.mCurPlayPos = 0;
		this.mCurPlayTotal = 0;
		this.mPlayerSource = "";
		this.mCurPlaySrc = "";
		this.mPlayerType = "";
		this.mPlayerState = MP.S_UNDEFINE;
		this.mRandomPlay = false;
		this.mPlayerName = "";
		this.mP2P = false;
		this.mSyncStatus = false;
		this.mExistTime = 0;
		this.mUinCookie = 0;
		this.mKeyCookie = "";
		this.mFromTag = 22;
		this.mIsInit = false;
		this.mRealInit = false;
		this.mInstall = false;
		this.mAlwreadyCheck = false;
		this.mHumanStop = false;
		this.mHumanPause = false;
		this.plv = "0";
		this.playerSrcSeted = false;
		this.mPlayUrl = "";
		this.mPlayBeginTime = 0;
		this.setPlayerState = function(status) {
			this.mPlayerState = status;
		}
		this.setPlayParams = function(iMusicId, sul) {
			this.mPlayerName.SetCookie("qqmusic_uin", this.mUinCookie);
			this.mPlayerName.SetCookie("qqmusic_key", this.mKeyCookie);
			this.mPlayerName.SetCookie("qqmusic_fromtag", this.mFromTag);
			var tiMusicId = "" + iMusicId;
			this.mPlayerName.SetCookie("qqmusic_musicid", tiMusicId);
			this.mPlayerName.SetCookie("qqmusicchkkey_key", this.mKeyCookie);
			this.mPlayerName.SetCookie("qqmusicchkkey_url", sul);
			return;
		};
		this.checkPlayer = function() {
			try {
				this.plv = this.mPlayerName.GetVersion(4);
			} catch (e) {
				MP.console.print("checkPlayer,exp:" + e.message);
				this.plv = "0";
			}
			return true;
		};
		this.getPlayerSource = function() {
			return this.mPlayerSource;
		};
		this.getCurrentPlayerSource = function() {
			return this.mCurPlaySrc;
		};
		this.setCurrentPlayerSource = function(arg) {
			return this.mCurPlaySrc = arg;
		};
		this.createActiveX = function(bv, bi, bp2p, name, w, h, uincn, keycn, dl) {
			try {
				this.mPlayerName = MP.createBPlayer();
				if (!this.mPlayerName) {
					return false;
				}
			} catch (e) {
				MP.console.print("createActiveX exp:" + e.message);
			}
			return "";
		};
		this.initialize = function() {
			MP.console.print("initialize 1");
			try {
				MP.console.print("initialize 2");
				if (!this.checkPlayer()) {
					MP.console.print("initialize 3");
					return false;
				}
				MP.console.print("initialize 4");
				this.mP2P = true;
				this.mSyncStatus = true;
				this.mInstall = true;
				this.mExistTime = 5;
				var oPlayer = this.mPlayerName;
				if (!oPlayer) {
					MP.console.print("initialize 3:");
					return false;
				}
				MP.EventPlayer(oPlayer, "OnInitialized", g_playerCallback.OnInitialized);
				MP.EventPlayer(oPlayer, "OnUninitialized", g_playerCallback.OnUnitialized);
				MP.EventPlayer(oPlayer, "OnStateChanged", g_playerCallback.OnStateChanged);
				MP.EventPlayer(oPlayer, "OnPlayProgress", g_playerCallback.OnPlayProgress);
				MP.EventPlayer(oPlayer, "OnPlayError", g_playerCallback.OnPlayError);
				MP.EventPlayer(oPlayer, "OnDnldProgress", g_playerCallback.OnDownloadProgress);
				MP.EventPlayer(oPlayer, "OnPlaySrcChanged", g_playerCallback.OnPlaySrcChanged);
				this.mPlayerName.Initialize();
				this.mPlayerSource = "miniplayer_player_2012" + "_" + new Date().getTime();
				MP.console.print("createActiveX 2,cookie radio:", MP.cookie.get("radio"));
				if (MP.cookie.get("radio").split("|")[0] == MP.user.getLoginUin() && MP.compareVer(this.plv, "8.5.2011.228") >= 0) {
					MP.console.print("createActiveX 3");
					this.mPlayerName.SetRef(-1);
					var tmpSrc = MP.cookie.get("radio").split("|");
					if (tmpSrc.length > 1) {
						this.mPlayerSource = tmpSrc[1];
					}
				}
				this.mPlayerName.PlaySrc = this.mPlayerSource;
				this.mCurPlaySrc = this.mPlayerSource;
				var vol = MP.cookie.get('fmvol') || 50;
				this.mPlayerName.Volume = vol;
			} catch (e) {
				MP.console.print("Qmp initialize exp:" + e.message);
				return false;
			}
			this.mIsInit = true;
			return true;
		};
		this.unInitialize = function() {
			try {
				var oPlayer = this.mPlayerName;
				MP.EventPlayerRemove(oPlayer, "OnInitialized", g_playerCallback.OnInitialized);
				MP.EventPlayerRemove(oPlayer, "OnUninitialized", g_playerCallback.OnUnitialized);
				MP.EventPlayerRemove(oPlayer, "OnStateChanged", g_playerCallback.OnStateChanged);
				MP.EventPlayerRemove(oPlayer, "OnPlayProgress", g_playerCallback.OnPlayProgress);
				MP.EventPlayerRemove(oPlayer, "OnPlayError", g_playerCallback.OnPlayError);
				MP.EventPlayerRemove(oPlayer, "OnDnldProgress", g_playerCallback.OnDownloadProgress);
				MP.EventPlayerRemove(oPlayer, "OnPlaySrcChanged", g_playerCallback.OnPlaySrcChanged);
				if ((this.mPlayerName).Uninitialize()) {
					this.mIsInit = false;
					return true;
				}
			} catch (e) {
				if (MP.debugMode) {
					window.status = ("e 9 " + e.message);
				}
				return false;
			}
		};
		this.isInitialize = function() {
			return this.mIsInit;
		};
		this.getStatus = function() {
			if (!this.mIsInit) {
				return -1;
			}
			var _s = -1;
			_s = this.mPlayerState;
			if (MP.compareVer(this.plv, "8.5.2011.228") >= 0) {
				_s = this.mPlayerName.GetCurState();
			}
			return _s;
		};
		this.setPlayURL = function(id, ul, stpt, iDuration, sSong, sSinger, sQzKey, iSongId, iSongType) {
			id = parseInt(id);
			var uin = MP.cookie.get(MP.PANEL_UIN_COOKIE_NAME);
			var key = MP.cookie.get(MP.PANEL_KEY_COOKIE_NAME);
			if (uin == "") {
				uin = MP.cookie.get("uin").replace(/[^\d]/g, "");
			};
			if (key == "") {
				key = MP.cookie.get("skey");
			};
			this.setUserIdent(uin != "" ? uin : '12345678', key != "" ? key : '12345678', this.mFromTag);
			if (!this.mIsInit) {
				return;
			}
			if (((ul == null) || (ul == "")) && (id < 0)) {
				return;
			}
			var tpp = 0;
			if (this.mP2P) {
				tpp = 1;
			}
			iSongId = iSongId || 0;
			iSongType = iSongType || 0;
			this.mPlayUrl = ul;
			this.mPlayBeginTime = new Date().getTime();
			if (ul.indexOf("qqmusic.qq.com") < 0) {
				stpt = "";
			}
			if (id <= 0) {
				stpt = "";
				this.setPlayParams(id, ul);
				this.mPlayingPos = this.mPlayList.getPos(ul);
				this.mPlayerName.SetPlayURL(id, ul, stpt);
				this.mPlayList.addObject(id, ul, stpt, 0, sSong, sSinger, "", iSongId, iSongType);
			} else {
				this.setPlayParams(id, ul);
				this.mPlayingPos = this.mPlayList.getPosById(id);
				this.mPlayerName.SetPlayURL(id, ul, stpt);
				this.mPlayList.addObject(id, ul, stpt, 0, sSong, sSinger, "", iSongId, iSongType);
			}
			return;
		};
		this.setPlayList = function() {};
		this.resetCache = function() {};
		this.isPlaying = function() {
			if (!this.mIsInit) {
				return false;
			}
			var _s = this.getStatus();
			return ((_s == MP.S_PLAYING) || (_s == MP.S_BUFFERING) || (_s == MP.S_PLAYBEGIN));
		};
		this.isPause = function() {
			if (!this.mIsInit) {
				return false;
			}
			var _s = this.mPlayerState;
			return (_s == MP.S_PAUSE);
		};
		this.lastBufTime = 0;
		this.isStop = function() {
			if (!this.mIsInit) {
				return false;
			}
			var _s = this.mPlayerState;
			if (_s == MP.S_BUFFERING) {
				var cur = new Date().getTime();
				if (cur - this.lastBufTime > 1000 * 60) {
					this.lastBufTime = new Date().getTime();
				}
				if (cur - this.lastBufTime > 1000 * 20) {
					this.lastBufTime = new Date().getTime();
					return true;
				}
			} else {
				this.lastBufTime = 0;
			}
			return ((_s == MP.S_STOP) || (_s == MP.S_PLAYEND));
		};
		this.getCurrentMusic = function() {
			if (this.mPlayingPos < 0) {
				return null;
			}
			return this.mPlayList.getObject(this.mPlayingPos);
		};
		this.runPlayerForce = function(pos) {
			try {
				pos = pos || 0;
				MP.pauseFromApp = false;
				var obj = this.mPlayList.getObject(pos);
				this.setPlayURL(obj.mId, obj.mPlayURL, obj.mTorrentURL, obj.mDuration, obj.mSongName, obj.mSingerName, obj.mQzoneKey);
			} catch (e) {}
		};
		this.runPlayerPos = function(pos) {
			if (this.isPause()) {
				this.startPlayer();
			} else if (pos >= 0 && pos < this.mPlayList.getCount()) {
				var obj = this.mPlayList.getObject(pos);
				this.setPlayURL(obj.mId, obj.mPlayURL, obj.mTorrentURL, obj.mDuration, obj.mSongName, obj.mSingerName, obj.mQzoneKey);
			}
		};
		this.runPlayer = function(ul) {
			if (!this.mIsInit) {
				return;
			}
			if (this.isPause()) {
				this.startPlayer();
			} else if (this.mPlayingPos < 0 && this.mPlayList.getCount() > 0) {
				this.mPlayingPos = 0;
				var obj = this.mPlayList.getObject(0);
				this.setPlayURL(obj.mId, obj.mPlayURL, obj.mTorrentURL, obj.mDuration, obj.mSongName, obj.mSingerName, obj.mQzoneKey);
			} else {
				this.startPlayer();
			}
			var strPatch = /qqmusic.qq.com/i;
			var tpos = this.mPlayingPos + 1;
			if (tpos > 0 && tpos < this.mPlayList.getCount()) {
				if (this.mPlayList.getObject(tpos).mPlayURL.search(strPatch)) {
					(this.mPlayerName).SetPrepareSong(this.mPlayList.getObject(tpos).mPlayURL, this.mPlayList.getObject(tpos).mTorrentURL);
				}
			}
			return;
		};
		this.startPlayer = function() {
			if (!this.mIsInit) {
				return false;
			}
			try {
				(this.mPlayerName).Play();
				return true;
			} catch (e) {
				MP.console.print("QQPlayer startPlayer exp: ", e.message);
			}
			return false;
		};
		this.stopPlayer = function() {
			if (!this.mIsInit) {
				return false;
			}
			try {
				(this.mPlayerName).Stop();
				return true;
			} catch (e) {
				if (MP.debugMode) {
					window.status = ("e 12 " + e.message);
				}
			}
			return false;
		};
		this.pausePlayer = function() {
			if (!this.mIsInit) {
				return false;
			}
			try {
				(this.mPlayerName).Pause();
			} catch (e) {
				MP.console.print("QQMusic player pausePlayer exp :", e.message);
			}
		};
		this.setMute = function(isMute) {
			if (!this.mIsInit) {
				return false;
			}
			var bSet = 0;
			if (arguments.length > 0) {
				bSet = isMute ? 1 : 0;
			} else {
				bSet = ((this.mPlayerName).Mute == 1 ? 0 : 1);
			}
			(this.mPlayerName).Mute = bSet;
			return bSet;
		};
		this.getMute = function() {
			if (!this.mIsInit) {
				return false;
			}
			var bSet = ((this.mPlayerName).Mute == 1 ? true : false);
			return bSet;
		};
		this.getVolumn = function() {
			if (!this.mIsInit) {
				return 0;
			}
			return (this.mPlayerName).Volume;
		};
		this.setVolumn = function(vol) {
			if (!this.mIsInit) {
				return false;
			}
			if ((this.mPlayerName).Mute == 1) {
				return false;
			}
			if (vol > 100) {
				vol = 100;
			}
			if (vol < 0) {
				vol = 0;
			}
			if (vol >= 0 && vol <= 100) {
				(this.mPlayerName).Volume = vol;
			}
			return true;
		};
		this.quickPlayer = function(pos) {
			if (!this.mIsInit) {
				return false;
			}
			if (!this.isPlaying()) {
				return false;
			}
			var curr = (this.mPlayerName).CurPos;
			curr = curr + pos;
			if (curr <= 0) {
				return false;
			}
			(this.mPlayerName).CurPos = curr;
			return true;
		};
		this.lastPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return -1;
			}
			this.mPlayingPos = this.mPlayingPos - 1;
			if ((this.mPlayingPos < 0) || (this.mPlayingPos >= this.mPlayList.getCount())) {
				this.mPlayingPos = 0;
			}
			var obj = this.mPlayList.getObject(this.mPlayingPos);
			this.setPlayURL(obj.mId, obj.mPlayURL, obj.mTorrentURL, obj.mDuration, obj.mSongName, obj.mSingerName, obj.mQzoneKey);
			return this.mPlayingPos;
		};
		this.nextPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return -1;
			}
			this.mPlayingPos = this.mPlayingPos + 1;
			if ((this.mPlayingPos >= this.mPlayList.getCount()) || (this.mPlayingPos < 0)) {
				this.mPlayingPos = 0;
			}
			var obj = this.mPlayList.getObject(this.mPlayingPos);
			this.setPlayURL(obj.mId, obj.mPlayURL, obj.mTorrentURL, obj.mDuration, obj.mSongName, obj.mSingerName, obj.mQzoneKey);
			var strPatch = /qqmusic.qq.com/i;
			var tpos = this.mPlayingPos + 1;
			if (tpos > 0 && tpos < this.mPlayList.getCount()) {
				if (this.mPlayList.getObject(tpos).mPlayURL.search(strPatch)) {
					(this.mPlayerName).SetPrepareSong(this.mPlayList.getObject(tpos).mPlayURL, this.mPlayList.getObject(tpos).mTorrentURL);
				}
			}
			return this.mPlayingPos;
		};
		this.setUserIdent = function(iUin, sKey, iFromTag) {
			this.mUinCookie = iUin;
			this.mKeyCookie = sKey;
			this.mFromTag = iFromTag + "";
		};
	}
	MP.getCurPlaySongInfo = function() {
		var obj = MP.getPlayer();
		if (!obj) {
			return {};
		}
		if (obj.mPlayList.getCount() > 0) {
			var curPos = (obj.mPlayingPos >= 0 && obj.mPlayingPos < obj.mPlayList.getCount() ? obj.mPlayingPos : 0);
			return obj.mPlayList.getObject(curPos);
		}
	}
	MP.g_songPlayLen = 0;
	MP.insertH5AudioPlayer = function(objAttrs) {
		MP.playerDiv = MP.getElementInBody("h5audio_media_con_fm", "div");
		var html = [];
		html.push("<audio ")
		for (var key in objAttrs) {
			html.push(key);
			html.push("='");
			html.push(objAttrs[key]);
			html.push("' ");
		}
		html.push("></audio>");
		MP.playerDiv.innerHTML = html.join("");
		return MP.playerDiv.firstChild;
	}
	MP.createH5AudioPlayer = function() {
		return MP.insertH5AudioPlayer({
			id: 'h5audio_media_fm',
			height: 0,
			width: 0,
			autoplay: 'false'
		});
	}
	var S_UNDEFINE = 0,
		S_STOP = 1,
		S_PAUSE = 2,
		S_PLAYING = 3,
		S_BUFFERING = 4,
		S_PLAYBEGIN = 5,
		S_PLAYEND = 6;
	MP.H5AudioPlayer = function(fromTag) {
		this.mCurPlayPos = 0;
		this.mPlayerName = "";
		this.mPlayerSrc = "";
		this.mInit = false;
		this.mMute = false;
		this.mPlayList = new MP.PlayerListManager();
		this.mPlayingPos = -1;
		this.mVisible = true;
		this.mInstall = true;
		this.mDLLink = "";
		this.mUinCookie = 0;
		this.mKeyCookie = "";
		this.mUinCookieName = "";
		this.mKeyCookieName = "";
		this.mFromTag = fromTag || 22;
		this.mRandomPlay = false;
		this.mPlayerState = 0;
		this._clientPlatform = false;
		this.firstPlay = true;
		this.mSetedCookie = false;
		this.isiPadLoad = 0;
		this.bereload = true;
		this.mPlayUrl = "";
		this.mPlayBeginTime = 0;
		this.setPlayerState = function(status) {
			this.mPlayerState = status;
		}
		this._checkClientPlatform = function() {
			var pl = navigator.platform.toLowerCase();
			var ipad = pl.match(/ipad/);
			if (ipad) {
				this._clientPlatform = "ipad";
				return true;
			}
			var iphone = pl.match(/iphone/);
			if (iphone) {
				this._clientPlatform = "iphone";
				return true;
			}
			var ipod = pl.match(/ipod/);
			if (ipod) {
				this._clientPlatform = "ipod";
				return true;
			}
			var win = pl.match(/win/);
			if (win) {
				this._clientPlatform = "win";
				return false;
			} else {
				this._clientPlatform = "not win";
				return true;
			}
			return false;
		}
		this.setUserIdent = function(iUin, sKey, iFromTag) {
			this.mUinCookie = iUin;
			this.mKeyCookie = sKey;
		};
		this.setMusicCookie = function() {
			{
				var uin = MP.cookie.get("qqmusic_uin");
				var key = MP.cookie.get("qqmusic_key");
				if (uin == "") {
					uin = MP.cookie.get("uin").replace(/[^\d]/g, "");
				};
				if (key == "") {
					key = MP.cookie.get("skey");
				};
				this.setUserIdent(uin != "" ? uin : '12345678', key != "" ? key : '12345678', this.mFromTag);
				MP.cookie.set("qqmusic_uin", uin, "qq.com", "/");
				MP.cookie.set("qqmusic_key", key, "qq.com", "/")
				MP.cookie.set("qqmusic_fromtag", this.mFromTag, "qq.com", "/");
			} {
				this.mPlayerName.setAttribute("src", "http://qzone-music.qq.com/fcg-bin/fcg_set_musiccookie.fcg?fromtag=" + this.mFromTag + "&p=" + Math.random());
				this.mPlayerName.load();
				this.mPlayerName.play();
				setTimeout(function() {
					MP.VH5Player.mSetedCookie = true;
				}, 4000);
			}
		};
		this.checkPlayer = function(dl) {
			var obj = this.mPlayerName;
			if (!obj) {
				return false;
			}
			if ( !! obj.canPlayType && !! obj.canPlayType('audio/mpeg')) {} else {
				return false;
			}
			return true;
		};
		this.createActiveX = function(bv, bi, name, w, h, uincn, keycn, dl) {
			this.mPlayerName = MP.createH5AudioPlayer();
			this.mVisible = bv;
			this.mInstall = bi;
			this.mUinCookieName = uincn;
			this.mKeyCookieName = keycn;
			this.mDLLink = dl;
			return "";
		};
		this.initialize = function() {
			try {
				if (!this.checkPlayer()) {
					if (this.mInstall) {
						alert("对不起，您的浏览器不支持HTML5 播放mp3！");
						window.location = this.mDLLink;
					}
					return false;
				}
				this.bindPlayEvent();
				this.setMusicCookie();
				this.mInit = true;
				return true;
			} catch (e) {
				return false;
			}
		};
		this.isInitialize = function() {
			return this.mInit;
		};
		this.getStatus = function() {
			if (!this.mInit) {
				return -1;
			}
			return this.mPlayerName.getAttribute("state");
		};
		this.getCurrentMusic = function() {
			if (this.mPlayingPos < 0) {
				return null;
			}
			return this.mPlayList.getObject(this.mPlayingPos);
		};
		this.runPlayerForce = function(pos) {
			try {
				pos = pos || 0;
				MP.pauseFromApp = false;
				var curObj = this.mPlayList.getObject(pos);
				this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			} catch (e) {}
		};
		this.runPlayerPos = function(pos) {
			if (pos >= 0 && pos < this.mPlayList.getCount()) {
				var curObj = this.mPlayList.getObject(pos);
				this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			}
		};
		this.runPlayer = function(ul, name, singerName, iSongId, iSongType) {
			if (this.mSetedCookie) {
				if (window.idRunPlayer) {
					clearTimeout(window.idRunPlayer);
				}
				this.realRunPlayer(ul, name, singerName, iSongId, iSongType);
			} else {
				window.idRunPlayer = setTimeout(function() {
					MP.VH5Player.runPlayer(ul, name, singerName, iSongId, iSongType)
				}, 500);
			}
			return;
		};
		this.realRunPlayer = function(ul, name, singerName, iSongId, iSongType) {
			if (!this.mInit) {
				return;
			}
			var oplay = this.mPlayerName;
			this.bereload = true;
			if (this.isPause() && oplay.src == ul) {
				this.bereload = false;
			} else if ((ul != null) && (ul != "")) {
				oplay.setAttribute("src", ul);
				name = name || "";
				singerName = singerName || "";
				iSongId = iSongId || 0;
				iSongType = iSongType || 0;
				this.mPlayList.addObject(iSongId, ul, "", 0, name, singerName, "", iSongId, iSongType);
				this.mPlayingPos = this.mPlayList.getPos(ul);
			}
			if ((this.mPlayingPos < 0) && (this.mPlayList.getCount() > 0)) {
				this.mPlayingPos = 0;
				oplay.setAttribute("src", this.mPlayList.getObject(0).mPlayURL);
			}
			try {} catch (e) {}
			try {
				this.mPlayUrl = ul;
				this.mPlayBeginTime = new Date().getTime();
			} catch (e) {}
			if (this._checkClientPlatform() && this.firstPlay) {
				setTimeout(function() {
					MP.VH5Player.startPlayer()
				}, 0);
				setTimeout(function() {
					MP.VH5Player.startPlayer()
				}, 1000);
				this.firstPlay = false;
			} else {
				this.startPlayer();
			}
			return;
		};
		this.bindPlayEvent = function() {
			var oplay = (this.mPlayerName);
			var _this = this;
			MP.event.on(oplay, "loadstart", function() {
				var oplay = MP.VH5Player.mPlayerName;
				oplay.setAttribute("state", g_playerStatus.S_BUFFERING);
				g_playerCallback.OnStateChanged(g_playerStatus.S_BUFFERING);
				if (( !! ua.isiPad || !! ua.isiPhone) && oplay.isiPadLoad < 1) {
					MP.VH5Player.isiPadLoad++;
					g_playerCallback.OnStateChanged(g_playerStatus.S_PAUSE);
				}
			});
			MP.event.on(oplay, "play", function() {
				var oplay = MP.VH5Player.mPlayerName;
				oplay.setAttribute("state", MP.S_PLAYBEGIN);
				g_playerCallback.OnStateChanged(g_playerStatus.S_PLAYBEGIN);
			});
			MP.event.on(oplay, "playing", function() {
				var oplay = MP.VH5Player.mPlayerName;
				g_playerCallback.OnStateChanged(g_playerStatus.S_PLAYING);
				oplay.setAttribute("state", MP.S_PLAYING);
				if (oplay.getAttribute("src").indexOf('fcg_set_musiccookie') > -1) {
					MP.VH5Player.mSetedCookie = true;
				}
			});
			MP.event.on(oplay, "pause", function() {
				var oplay = MP.VH5Player.mPlayerName;
				g_playerCallback.OnStateChanged(g_playerStatus.S_PAUSE);
				oplay.setAttribute("state", MP.S_PAUSE);
			});
			MP.event.on(oplay, "stalled", function() {
				var oplay = MP.VH5Player.mPlayerName;
				oplay.setAttribute("state", MP.S_STOP);
				g_playerCallback.OnStateChanged(g_playerStatus.S_STOP);
				if (oplay.getAttribute("src").indexOf('fcg_set_musiccookie') > -1) {
					MP.VH5Player.mSetedCookie = true;
				}
			});
			MP.event.on(oplay, "error", function() {
				var oplay = MP.VH5Player.mPlayerName;
				oplay.setAttribute("state", MP.S_STOP);
				if (oplay.getAttribute("src").indexOf('fcg_set_musiccookie') > -1) {
					MP.VH5Player.mSetedCookie = true;
				}
				g_playerCallback.OnStateChanged(g_playerStatus.S_STOP);
				if (( !! ua.isiPad || !! ua.isiPhone) && oplay.error.code == 4) {
					g_playerCallback.OnStateChanged(g_playerStatus.S_BUFFERING);
					MP.VH5Player.isiPadLoad = 0;
				} else {
					var _obj = g_webPlayer.getSongInfoObj();
					if ( !! _obj.mid && !! _obj.mstream && _obj.mid > 0 && _obj.mstream > 0) {} else if ( !! _obj.msongurl) {
						if (_obj.msongurl.indexOf(".wma") > -1) {
							MP.showMsgbox('播放控件不支持wma格式，暂时无法播放。');
						} else {
							MP.showMsgbox('网络链接失效，暂时无法播放。');
						}
					}
				}
			});
			MP.event.on(oplay, "ended", function() {
				var oplay = MP.VH5Player.mPlayerName;
				g_playerCallback.OnStateChanged(g_playerStatus.S_PLAYEND);
				oplay.setAttribute("state", MP.S_PLAYEND);
			});
			MP.event.on(oplay, "timeupdate", function() {
				var oplay = MP.VH5Player.mPlayerName;
				var lCurPos = Math.floor(oplay.currentTime);
				var lTotal = Math.floor(oplay.duration);
				try {
					g_playerCallback.OnPlayProgress(lCurPos, lTotal);
					g_playerCallback.OnDownloadProgress(lCurPos, Math.ceil(oplay.buffered.end(0) * 100 / oplay.duration));
				} catch (e) {}
				if (lCurPos >= lTotal - 1) {
					MP.VH5Player.stopPlayer();
					oplay.setAttribute("state", MP.S_PLAYEND);
					g_playerCallback.OnStateChanged(g_playerStatus.S_PLAYEND);
				}
			});
			MP.event.on(oplay, "loadedmetadata", function() {
				var oplay = MP.VH5Player.mPlayerName;
				if ( !! ua.safari && !( !! ua.isiPad || !! ua.isiPhone)) {
					oplay.currentTime = 1;
					oplay.play();
				}
			});
			MP.event.on(oplay, "loadeddata", function() {});
			MP.event.on(oplay, "canplay", function() {});
		}
		this.startPlayer = function() {
			var oplay = (this.mPlayerName);
			try {
				if (this.bereload) {
					oplay.load();
				}
				oplay.play();
			} catch (e) {
				if (debugMode) {
					status = ("e 2 " + e.message);
				}
			}
			return false;
		};
		this.stopPlayer = function() {
			if (!this.mInit) {
				return false;
			}
			if ((!this.isPlaying()) && (!this.isPause())) {
				return false;
			}
			try {
				var oplay = this.mPlayerName;
				oplay.pause();
				oplay.setAttribute("src", "");
			} catch (e) {
				if (debugMode) {
					status = ("e 3 " + e.message);
				}
			}
			return true;
		};
		this.pausePlayer = function() {
			if (!this.mInit) {
				return false;
			}
			try {
				var oplay = this.mPlayerName;
				oplay.pause();
			} catch (e) {
				if (debugMode) {
					status = ("e 4 " + e.message);
				}
			}
			return true;
		};
		this.isPlaying = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return ((_s == MP.S_PLAYING) || (_s == MP.S_BUFFERING) || (_s == MP.S_PLAYBEGIN));
		};
		this.isPause = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return (_s == MP.S_PAUSE || this.mPlayerName.paused);
		};
		this.isStop = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return ((_s == MP.S_STOP) || this.mPlayerName.ended || (_s == MP.S_MEDIAEND) || (_s == MP.S_UNDEFINE) || (_s == MP.S_READY));
		};
		this.setMute = function() {
			if (!this.mInit) {
				return false;
			}
			var oplay = this.mPlayerName;
			if (oplay.muted) {
				oplay.muted = false;
			} else {
				oplay.muted = true;
			}
			return true;
		};
		this.getVolumn = function() {
			if (!this.mInit) {
				return 0;
			}
			return (this.mPlayerName).volume * 100;
		};
		this.setVolumn = function(vol) {
			if (!this.mInit) {
				return false;
			}
			var oplay = (this.mPlayerName);
			if (oplay.muted) {
				return false;
			}
			if (vol > 100) {
				vol = 100;
			}
			if (vol < 0) {
				vol = 0;
			}
			if (vol >= 0 && vol <= 100) {
				oplay.volume = vol / 100;
			}
			return true;
		};
		this.quickPlayer = function(pos) {
			if (!this.mInit) {
				return false;
			}
			if (!this.isPlaying()) {
				return false;
			}
			var oplay = this.mPlayerName;
			if ((oplay.currentTime + pos) >= oplay.duration) {
				return false;
			}
			if ((oplay.currentTime + pos) <= 0) {
				return false;
			}
			oplay.currentTime += pos;
			return true;
		};
		this.lastPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return;
			}
			this.mPlayingPos = this.mPlayingPos - 1;
			if ((this.mPlayingPos < 0) || (this.mPlayingPos >= this.mPlayList.getCount())) {
				this.mPlayingPos = this.mPlayList.getCount() - 1;
			}
			var curObj = this.mPlayList.getObject(this.mPlayingPos);
			this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			return this.mPlayingPos;
		};
		this.nextPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return -1;
			}
			this.mPlayingPos = this.mPlayingPos + 1;
			if ((this.mPlayingPos >= this.mPlayList.getCount()) || (this.mPlayingPos < 0)) {
				this.mPlayingPos = 0;
			}
			var curObj = this.mPlayList.getObject(this.mPlayingPos);
			this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			return this.mPlayingPos;
		};
		this.setBalance = function() {};
		this.getErrorMsg = function() {
			var errorDesc = this.mPlayerName.error.item(0).errorDescription;
			return errorDesc;
		};
		this.printPlayList = function() {
			var list = "";
			for (var i = this.mPlayList.getCount(); i > 0; i--) {
				list = list + "第[" + i + "]" + "播放记录:" + this.mPlayList.getObject(i - 1).mPlayURL + "\n";
			}
			return list;
		};
	};
	window.g_flashPlayer = window.g_flashPlayer || {};
	g_flashPlayer.swfReady = false;
	g_flashPlayer.swfInitComplete = function() {
		g_flashPlayer.swfReady = true;
		MP.console.print("g_flashPlayer.swfReady, ", g_flashPlayer.swfReady);
	};
	MP.insertFlashPlayer = function() {
		MP.playerDiv = MP.getElementInBody("flash_media_con_fm", "div");
		MP.playerDiv.innerHTML = MP.media.getFlashHtml({
			width: 1,
			height: 1,
			src: "http://imgcache.qq.com/music/miniplayer/MusicPlayer.swf",
			quality: 'high',
			wmode: 'transparent',
			id: "flashMusicPlayerFm",
			name: "flashMusicPlayer",
			allowScriptAccess: 'always'
		}, '7,0,0,0');
		return MP.playerDiv.firstChild;
	};
	MP.createFlashPlayer = function() {
		return MP.insertFlashPlayer();
	};
	MP.flashPlayState = {
		0: S_STOP,
		1: S_PLAYBEGIN,
		2: S_PLAYING,
		3: S_PAUSE,
		4: S_BUFFERING,
		5: S_PLAYEND
	};
	MP.FlashMusicPlayer = function(fromTag) {
		this.mCurPlayPos = 0;
		this.mPlayerName = "";
		this.mPlayerSrc = "";
		this.mInit = false;
		this.mMute = false;
		this.mPlayList = new MP.PlayerListManager();
		this.mPlayingPos = -1;
		this.mVisible = true;
		this.mInstall = true;
		this.mDLLink = "";
		this.mUinCookie = 0;
		this.mKeyCookie = "";
		this.mUinCookieName = "";
		this.mKeyCookieName = "";
		this.mFromTag = fromTag || 22;
		this.mRandomPlay = false;
		this.mPlayerState = 0;
		this._clientPlatform = false;
		this.firstPlay = true;
		this.mSetedCookie = false;
		this.bereload = true;
		this.mPlayUrl = "";
		this.mPlayBeginTime = 0;
		this.setCookieCount = 0;
		this.setCookieMax = 10;
		this.setPlayerState = function(status) {
			this.mPlayerState = status;
		}
		this.setUserIdent = function(iUin, sKey, iFromTag) {
			this.mUinCookie = iUin;
			this.mKeyCookie = sKey;
		};
		this.realSetMusicCookie = function() {
			MP.console.print("MP.VFlashPlayer.realSetMusicCookie 1");
			var uin = MP.cookie.get("qqmusic_uin");
			var key = MP.cookie.get("qqmusic_key");
			if (uin == "") {
				uin = MP.cookie.get("uin").replace(/[^\d]/g, "");
			};
			if (key == "") {
				key = MP.cookie.get("skey");
			};
			this.setUserIdent(uin != "" ? uin : '12345678', key != "" ? key : '12345678', this.mFromTag);
			MP.console.print("MP.VFlashPlayer.realSetMusicCookie 2");
			MP.cookie.set("qqmusic_uin", uin, "qq.com", "/");
			MP.cookie.set("qqmusic_key", key, "qq.com", "/")
			MP.cookie.set("qqmusic_fromtag", this.mFromTag, "qq.com", "/");
			MP.console.print("MP.VFlashPlayer.realSetMusicCookie 3");
			this.mPlayUrl = "http://qzone-music.qq.com/fcg-bin/fcg_set_musiccookie.fcg?fromtag=" + this.mFromTag + "&p=" + Math.random();
			MP.console.print("MP.VFlashPlayer.realSetMusicCookie 4");
			this.mPlayerName.swfPlayMusic(this.mPlayUrl, 5);
			setTimeout(function() {
				MP.VFlashPlayer.mSetedCookie = true;
				MP.console.print("MP.VFlashPlayer.mSetedCookie");
			}, 3000);
		}
		this.setMusicCookie = function() {
			MP.console.print("setMusicCookie 1, g_flashPlayer.swfReady = " + g_flashPlayer.swfReady);
			if (g_flashPlayer.swfReady) {
				MP.console.print("setMusicCookie, runPlayer 1");
				if (window.idSetMusicCookie) {
					clearTimeout(window.idSetMusicCookie);
				}
				this.realSetMusicCookie();
			} else {
				MP.console.print("setMusicCookie, runPlayer 2");
				if (MP.VFlashPlayer.setCookieCount < MP.VFlashPlayer.setCookieMax) {
					window.idSetMusicCookie = setTimeout(function() {
						MP.VFlashPlayer.setMusicCookie()
					}, 500);
				} else {
					if (window.idSetMusicCookie) {
						clearTimeout(window.idSetMusicCookie);
					}
				}
			}
		};
		this.checkPlayer = function(dl) {
			var obj = this.mPlayerName;
			MP.console.print("MP.FlashMusicPlayer.checkPlayer, !!this.mPlayerName:", !! obj);
			if (!obj) {
				return false;
			}
			return true;
		};
		this.createActiveX = function(bv, bi, name, w, h, uincn, keycn, dl) {
			this.mPlayerName = MP.createFlashPlayer();
			this.mInstall = bi;
			return "";
		};
		this.initialize = function() {
			try {
				if (!this.checkPlayer()) {
					if (this.mInstall) {
						alert("对不起，您的浏览器不支持flash音频播放！");
					}
					MP.console.print("MP.VFlashPlayer.initialize 1");
					return false;
				}
				MP.console.print("MP.VFlashPlayer.initialize 2");
				this.setMusicCookie();
				MP.console.print("MP.VFlashPlayer.initialize 3");
				this.mInit = true;
				try {} catch (e) {};
				this.bindPlayEvent();
				MP.console.print("MP.VFlashPlayer.initialize 4");
				return true;
			} catch (e) {
				MP.console.print("MP.VFlashPlayer.initialize 5,exp:", e.message);
				return false;
			}
		};
		this.isInitialize = function() {
			return this.mInit;
		};
		this.getStatus = function() {
			if (!this.mInit) {
				return -1;
			}
			return MP.flashPlayState[this.mPlayerName.swfGetPlayStat()];
		};
		this.getCurrentMusic = function() {
			if (this.mPlayingPos < 0) {
				return null;
			}
			return this.mPlayList.getObject(this.mPlayingPos);
		};
		this.runPlayerForce = function(pos) {
			try {
				pos = pos || 0;
				MP.pauseFromApp = false;
				var curObj = this.mPlayList.getObject(pos);
				this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			} catch (e) {}
		};
		this.runPlayerPos = function(pos) {
			if (pos >= 0 && pos < this.mPlayList.getCount()) {
				var curObj = this.mPlayList.getObject(pos);
				this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			}
		};
		this.runPlayer = function(ul, name, singerName, iSongId, iSongType) {
			if (g_flashPlayer.swfReady && this.mSetedCookie) {
				MP.console.print("runPlayer, 1");
				if (window.idRunPlayer) {
					clearTimeout(window.idRunPlayer);
				}
				this.realRunPlayer(ul, name, singerName, iSongId, iSongType);
			} else {
				MP.console.print("runPlayer, 2");
				if (MP.VFlashPlayer.setCookieCount >= MP.VFlashPlayer.setCookieMax) {
					if (window.idRunPlayer) {
						clearTimeout(window.idRunPlayer);
					}
					MP.updateDownloadPlayer();
				} else {
					window.idRunPlayer = setTimeout(function() {
						MP.VFlashPlayer.runPlayer(ul, name, singerName, iSongId, iSongType)
					}, 500);
				}
			}
			return;
		};
		this.realRunPlayer = function(ul, name, singerName, iSongId, iSongType) {
			MP.console.print("realRunPlayer 1,ul:" + ul);
			if (!this.mInit) {
				MP.console.print("runPlayer 2,ul:" + ul);
				return;
			}
			MP.console.print("realRunPlayer 2.1,ul:" + ul);
			var oplay = this.mPlayerName;
			this.bereload = true;
			if (this.isPause() && this.mPlayUrl == ul) {
				MP.console.print("realRunPlayer 3,oplay.src:" + oplay.src + ";ul:" + ul);
				this.bereload = false;
			} else if ((ul != null) && (ul != "")) {
				MP.console.print("realRunPlayer 4,oplay.src:" + oplay.src + ";ul:" + ul);
				oplay.swfPlayMusic(ul, 5);
				name = name || "";
				singerName = singerName || "";
				iSongId = iSongId || 0;
				iSongType = iSongType || 0;
				this.mPlayList.addObject(iSongId, ul, "", 0, name, singerName, "", iSongId, iSongType);
				this.mPlayingPos = this.mPlayList.getPos(ul);
				MP.console.print("realRunPlayer 4,ul:" + ul);
			}
			if ((this.mPlayingPos < 0) && (this.mPlayList.getCount() > 0)) {
				this.mPlayingPos = 0;
				oplay.swfPlayMusic(this.mPlayList.getObject(0).mPlayURL, 5);
				MP.console.print("realRunPlayer 5");
			}
			try {
				this.mPlayUrl = ul;
				this.mPlayBeginTime = +new Date();
			} catch (e) {}
			this.startPlayer();
			return;
		};
		this.bindPlayEvent = function() {
			window.g_flashPlayer = window.g_flashPlayer || {};
			g_flashPlayer.soundStatChange = function(dataObj) {
				MP.console.print("dataObj.playStat:", dataObj.playStat, "realStat:", MP.flashPlayState[dataObj.playStat]);
				if (MP.VFlashPlayer.mPlayUrl.indexOf('fcg_set_musiccookie') > -1) {
					MP.VFlashPlayer.mSetedCookie = true;
				}
				g_playerCallback.OnStateChanged(MP.flashPlayState[dataObj.playStat]);
			};
			g_flashPlayer.soundData = function(dataObj) {
				g_playerCallback.OnPlayProgress(dataObj.position, MP.VFlashPlayer.mPlayerName.swfGetTotalTime());
				g_playerCallback.OnDownloadProgress(0, dataObj.progress);
			};
			g_flashPlayer.soundIOError = function(msg) {
				if (MP.VFlashPlayer.mPlayUrl.indexOf('fcg_set_musiccookie') > -1) {
					MP.VFlashPlayer.mSetedCookie = true;
				}
				g_playerCallback.OnStateChanged(g_playerStatus.S_STOP);
				MP.console.print("playError:", msg);
			};
		}
		this.startPlayer = function() {
			var oplay = (this.mPlayerName);
			try {
				oplay.swfPlayMusic();
			} catch (e) {
				MP.console.print("flash player startPlayer exp : ", e.message);
			}
			return false;
		};
		this.stopPlayer = function() {
			if (!this.mInit) {
				return false;
			}
			if ((!this.isPlaying()) && (!this.isPause())) {
				return false;
			}
			try {
				var oplay = this.mPlayerName;
				oplay.swfStopMusic();
			} catch (e) {
				MP.console.print("flash player stopPlayer exp : ", e.message);
			}
			return true;
		};
		this.pausePlayer = function() {
			if (!this.mInit) {
				return false;
			}
			try {
				var oplay = this.mPlayerName;
				oplay.swfPauseMusic();
			} catch (e) {
				MP.console.print("flash player pausePlayer  exp : ", e.message);
			}
			return true;
		};
		this.isPlaying = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return ((_s == MP.S_PLAYING) || (_s == MP.S_BUFFERING) || (_s == MP.S_PLAYBEGIN));
		};
		this.isPause = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return (_s == MP.S_PAUSE);
		};
		this.isStop = function() {
			if (!this.mInit) {
				return false;
			}
			var _s = this.getStatus();
			return ((_s == MP.S_STOP) || (_s == MP.S_MEDIAEND) || (_s == MP.S_UNDEFINE) || (_s == MP.S_READY));
		};
		this.setMute = function(isMute) {
			if (!this.mInit) {
				return false;
			}
			isMute = isMute || false;
			var oplay = this.mPlayerName;
			if (!isMute && oplay.swfGetMute()) {
				oplay.swfSetMute(false);
			} else {
				oplay.swfSetMute(true);
			}
			return true;
		};
		this.getVolumn = function() {
			if (!this.mInit) {
				return 0;
			}
			return (this.mPlayerName).swfGetVolume();
		};
		this.setVolumn = function(vol) {
			if (!this.mInit) {
				return false;
			}
			var oplay = (this.mPlayerName);
			if (oplay.swfGetMute()) {
				return false;
			}
			if (vol > 100) {
				vol = 100;
			}
			if (vol < 0) {
				vol = 0;
			}
			if (vol >= 0 && vol <= 100) {
				oplay.swfSetVolume(vol);
			}
			return true;
		};
		this.quickPlayer = function(pos) {
			if (!this.mInit) {
				return false;
			}
			var oplay = this.mPlayerName,
				quickPos = (oplay.swfGetPosion() + pos);
			if (quickPos >= oplay.swfGetTotalTime() || quickPos <= 0) {
				return false;
			}
			oplay.swfSeekMusic(quickPos);
			return true;
		};
		this.lastPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return;
			}
			this.mPlayingPos = this.mPlayingPos - 1;
			if ((this.mPlayingPos < 0) || (this.mPlayingPos >= this.mPlayList.getCount())) {
				this.mPlayingPos = this.mPlayList.getCount() - 1;
			}
			var curObj = this.mPlayList.getObject(this.mPlayingPos);
			this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			return this.mPlayingPos;
		};
		this.nextPlayer = function() {
			if (this.mPlayList.getCount() == 0) {
				return -1;
			}
			this.mPlayingPos = this.mPlayingPos + 1;
			if ((this.mPlayingPos >= this.mPlayList.getCount()) || (this.mPlayingPos < 0)) {
				this.mPlayingPos = 0;
			}
			var curObj = this.mPlayList.getObject(this.mPlayingPos);
			this.runPlayer(curObj.mPlayURL, curObj.mSongName, curObj.mSingerName, curObj.mSongId, curObj.mSongType);
			return this.mPlayingPos;
		};
		this.setBalance = function() {};
		this.getErrorMsg = function() {
			return "";
		};
	};
	MP.BrunPlayer = function(pos) {
		if (pos == null) {
			pos = -1;
		}
		var oPlayer = MP.getPlayer();
		if (!oPlayer) {
			return;
		}
		if (pos == -1) {
			var cPos = oPlayer.mPlayingPos;
			if (cPos > -1) {
				oPlayer.runPlayerPos(cPos);
			} else {
				oPlayer.runPlayer('');
			}
		} else {
			oPlayer.runPlayerPos(pos);
		}
	};
	MP.getPlayer = function() {
		return MP.bUseBQQPlayer && MP.BQQPlayer ? MP.BQQPlayer : ( !! MP.MediaPlayer ? MP.MediaPlayer : ( !! MP.VH5Player ? MP.VH5Player : ( !! MP.VFlashPlayer ? MP.VFlashPlayer : false)));
	};
	MP.BpausePlayer = function() {
		MP.getPlayer() && MP.getPlayer().pausePlayer();
	};
	MP.BstopPlayer = function() {
		MP.getPlayer() && MP.getPlayer().stopPlayer();
	};
	MP.BlastPlayer = function() {
		MP.getPlayer() && MP.getPlayer().lastPlayer();
	};
	MP.BnextPlayer = function() {
		MP.getPlayer() && MP.getPlayer().nextPlayer();
	};
	MP.BmutePlayer = function(isMute) {
		MP.getPlayer() && MP.getPlayer().setMute(isMute);
	};
	MP.getMute = function() {
		MP.getPlayer() && MP.getPlayer().getMute();
	};
	MP.Qmute = function(isMute) {
		MP.BmutePlayer(isMute);
	};
	MP.setVolumn = function(type) {
		MP.getPlayer() && MP.getPlayer().setVolumn(type);
	};
	MP.pauseFromApp = false;
	MP.pauseAppMusic = function() {
		if (MP.fp.isWeibo()) {
			return;
		}
		try {
			MP.pauseFromApp = false;
			var w = MUSIC.pengyouWin;
			if (typeof(w) == "object" && w != null) {
				w.MUSIC.ICMusic.hideFlash();
			}
		} catch (e) {
			MUSIC.pengyouWin = null;
		}
	};
	MP.BQplay = function(pos) {
		MP.pauseAppMusic();
		if (MP.bqqplayer_play_flag != null) {
			MP.bqqplayer_play_flag = true;
		}
		if ( !! ua.safari || (ua && !! ua.chrome && !ua.tt >= 5)) {
			var html5Audio = MP.getPlayer();
			if (typeof html5Audio != "undefined") {
				html5Audio.bereload = false;
				html5Audio.startPlayer();
			}
		} else {
			MP.BrunPlayer(pos);
		}
	};
	MP.isQdo = function() {
		if (MP.bUseBQQPlayer && MP.BQQPlayer) {
			if (MP.BQQPlayer.getPlayerSource() == MP.BQQPlayer.getCurrentPlayerSource()) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	};
	MP.BQstop = function() {
		function realStop() {
			if (MP.bqqplayer_play_flag != null) {
				MP.bqqplayer_play_flag = false;
			}
			if (MP.idBAutoPlay) {
				clearTimeout(MP.idBAutoPlay);
			}
			MP.BstopPlayer();
		}
		MP.isQdo() && realStop();
	};
	MP.BQpause = function() {
		if (MP.isQdo()) {
			if (MP.idBAutoPlay) {
				clearTimeout(MP.idBAutoPlay);
			}
			MP.BpausePlayer();
		}
	};
	MP.BQnext = function() {
		MP.BnextPlayer();
	};
	MP.BQprevious = function() {
		MP.BlastPlayer();
	};
	MP.getExactQusicID = function(sPlayUrl) {
		if (sPlayUrl.indexOf("qqmusic.qq.com") < 0) {
			return 0;
		}
		var st = sPlayUrl.entityReplace();
		var sl = st.split("/");
		var sm = sl[sl.length - 1];
		var si = sm.split(".");
		return si[0] ? si[0] : 0;
	};
	MP.getQusicID = function(sPlayUrl) {
		var qusidt = Number(MP.getExactQusicID(sPlayUrl));
		if (isNaN(qusidt)) {
			qusidt = 0;
		}
		if (qusidt > 30000000) {
			qusidt -= 30000000;
		}
		if (qusidt > 12000000) {
			qusidt -= 12000000;
		}
		return qusidt;
	};
	MP.getLocalReportID = function(sPlayUrl) {
		return 0;
	};
	MP.getQusicURL = function(sPlayUrl) {
		var pos = sPlayUrl.indexOf("qqmusic.qq.com");
		if (pos != -1) {
			var qusidt = Number(MP.getExactQusicID(sPlayUrl));
			if (qusidt > 0 && qusidt < 12000000) {
				qusidt += 12000000;
			}
			sPlayUrl = sPlayUrl.substring(0, pos + 14) + "/" + qusidt + (qusidt > 30000000 ? ".mp3" : ".wma");
		}
		return sPlayUrl;
	};
	MP.URLencode = function(ss) {
		if (ss == "http://" || (ss.substring(0, 7) != "http://" && ss.substring(0, 6) != "mms://")) {
			return "";
		}
		return ss.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").replace(/\r/g, "%0A").replace(/\n/g, "%0D").replace(/,/g, "%27");
	};
	MP.getStreamID = function(sPlayUrl) {
		var st = sPlayUrl;
		var sl = st.split("/");
		var sm = sl[2];
		var si = sm.split("m");
		return si[1] ? si[1] : 0;
	};
	MP.getQusicH5URL = function(sPlayUrl) {
		var pos = sPlayUrl.indexOf("qqmusic.qq.com");
		if (pos != -1) {
			var qusidt = Number(MP.getExactQusicID(sPlayUrl));
			if (qusidt > 0 && qusidt < 30000000) {
				if (qusidt > 12000000) {
					qusidt -= 12000000;
				}
				qusidt += 30000000;
			}
			var streamId = parseInt(MP.getStreamID(sPlayUrl));
			streamId = (streamId < 11 ? streamId + 10 : streamId);
			sPlayUrl = "http://stream" + streamId + ".qqmusic.qq.com/" + qusidt + ".mp3";
		}
		return sPlayUrl;
	};
	MP.BplayOneSong = function(name, urlin, qusid, singerName, iSongId, iSongType) {
		try {
			if ( !! MP.isNeedUpdatePlayer) {
				MP.updateDownloadPlayer();
				return;
			}
			var url = urlin.entityReplace().replace(/\[/g, "").replace(/\]/g, ""),
				regstr = new RegExp("&apos;", "g");
			url = MP.URLencode(url);
			name = name.replace(regstr, "\'");
			singerName = singerName || "";
			if (url.indexOf("music.qq.com") < 0) {
				qusid = 0;
			}
			iSongId = iSongId || qusid;
			var m = MP.tj2rp;
			iSongType = iSongType || m.getSongType(url); {
				m.statSong({
					id: iSongId,
					type: iSongType,
					fromtag2: 602
				});
			}
			if (MP.bUseBQQPlayer) {
				MP.BQQPlayer.mPlayList.clearObject();
				var sTorrentURL = "";
				var strPatch = /qqmusic.qq.com/i;
				if (url.search(strPatch)) {
					if (parseInt(qusid) > 0) {
						url = MP.getQusicURL(url);
						sTorrentURL = "http://tpt.music.qq.com/" + MP.getExactQusicID(url) + ".tpt";
					} else {
						sTorrentURL = "";
					}
				}
				MP.BQQPlayer.setPlayURL(qusid, url, sTorrentURL, 0, name, singerName, "", iSongId, iSongType);
			} else {
				if (( !! ua.safari || (ua && !! ua.chrome)) && MP.VH5Player) {
					MP.VH5Player.mPlayList.clearObject();
					var strPatch = /qqmusic.qq.com/i;
					if (url.search(strPatch)) {
						if (parseInt(qusid) > 0) {
							url = MP.getQusicH5URL(url);
						}
					}
					MP.VH5Player.runPlayer(url, name, singerName, iSongId, iSongType, true);
				} else if (MP.VFlashPlayer) {
					MP.VFlashPlayer.mPlayList.clearObject();
					var strPatch = /qqmusic.qq.com/i;
					if (url.search(strPatch)) {
						if (parseInt(qusid) > 0) {
							url = MP.getQusicH5URL(url);
						}
					}
					MP.VFlashPlayer.runPlayer(url, name, singerName, iSongId, iSongType, true);
				} else {
					MP.MediaPlayer.mPlayList.clearObject();
					if (parseInt(qusid) > 0) {
						url = MP.getQusicURL(url);
					}
					MP.MediaPlayer.runPlayer(url, name, singerName, iSongId, iSongType);
					MP.loopCheckPlayer();
				}
			}
		} catch (e) {}
	};
	MP.BplaySong = function(name, url, qusid, singerName, iSongId, iSongType) {
		MP.pauseAppMusic();
		MP.initMusic(function() {
			MP.BplayOneSong(name, url, qusid, singerName, iSongId, iSongType);
		});
	};
	MP.BplaySong_local = function(name, url, qusid, singerName, iSongId, iSongType) {
		var iReportID = MP.getLocalReportID(url);
		MP.BplaySong(name, url, iReportID, singerName, iSongId, iSongType);
	};
	MP.getQuickTimePlugin = function() {
		var n = navigator;
		if (n.plugins && n.plugins.length) {
			var ii = 0,
				ll = n.plugins.length;
			for (; ii < ll; ii++) {
				if (/quicktime/.test(n.plugins[ii].name.toLowerCase())) {
					return true;
				}
			}
		}
		return false;
	};
	MP.updateDownloadPlayer = function() {
		try {
			var strHTML = '<iframe id="download_QQPlayer" frameborder="0" src="http://imgcache.qq.com/music/musicbox_v2_1/doc/downloadPlayer.html" allowTransparency="true" style="width:474px;height:311px;"></iframe>';
			MP.widget.popupDialog("下载最新版QQ音乐播放控件", strHTML, 476, 311);
			top.popupCallback = function() {};
		} catch (e) {
			MP.console.print("open update download qqplayer html exp: ", e.message);
		}
	};
	MP.createProxy = function(src) {
		var f = document.getElementsByTagName("iframe"),
			i = 0,
			l = f.length;
		for (; i < l; i++) {
			if (f[i].src.indexOf(src) != -1) {
				return;
			};
		}
		var i = document.createElement("iframe");
		i.id = "proxy_qmp";
		document.body.insertBefore(i, null);
		i.width = 0;
		i.height = 0;
		i.src = src;
		i = null;
	};
	MP.compareVer = function(v1, v2) {
		try {
			tv1 = v1.split(".");
			tv2 = v2.split(".");
			var d = 0,
				i = 0,
				l1 = tv1.length,
				l2 = tv2.length;
			for (; i < l1 && i < l2; i++) {
				d = parseInt(tv1[i], 10) - parseInt(tv2[i], 10);
				if (d > 0) {
					return 1;
				} else if (d < 0) {
					return -1;
				} else {
					continue;
				}
			}
			return 0;
		} catch (e) {
			return -2;
		}
	};
	MP.addedPlayerDomain = false;
	MP.musicCb = null;
	MP.isNeedUpdatePlayer = false;
	MP.initMusic = function(cb) {
		MP.musicCb = null;

		function initQmp() {
			try {
				MP.console.print("initQmp 1, MP.fp.isWeibo():", MP.fp.isWeibo(), ", MP.addedPlayerDomain:" + MP.addedPlayerDomain);
				if (!MP.addedPlayerDomain) {
					MP.musicCb = cb;
					MP.createProxy("http://music.qq.com/musicapp/miniplayer/playctrl_adddomain_mp.html");
					return true;
				}
				MP.BQQPlayer = null;
				MP.MediaPlayer = null;
				MP.VH5Player = null;
				MP.VFlashPlayer = null;
				MP.bUseBQQPlayer = true;
				MP.BQQPlayer = new MP.BlogQQPlayer();
				MP.BQQPlayer.createActiveX(true, false, false, "qqplayer", "0", "0", MP.PANEL_UIN_COOKIE_NAME, MP.PANEL_KEY_COOKIE_NAME, "http://www.qq.com");
				if (MP.BQQPlayer.initialize()) {
					window.musicPlayerReady = true;
					MP.tj2rp.playerType = 1;
					return true;
				} else {
					MP.bUseBQQPlayer = false;
					MP.BQQPlayer = null;
					MP.tj2rp.playerType = 0;
					return false;
				}
				return true;
			} catch (e) {
				MP.bUseBQQPlayer = false;
				MP.BQQPlayer = null;
				return false;
			}
		};

		function initH5Audio() {
			try {
				MP.addedPlayerDomain = true;
				MP.bUseBQQPlayer = false;
				MP.BQQPlayer = null;
				MP.MediaPlayer = null;
				MP.VFlashPlayer = null;
				if (!MP.VH5Player) MP.VH5Player = new MP.H5AudioPlayer();
				MP.VH5Player.createActiveX(true, false, "h5player", "0", "0", MP.PANEL_UIN_COOKIE_NAME, MP.PANEL_KEY_COOKIE_NAME, "http://www.qq.com");
				if (MP.VH5Player.initialize()) {
					window.musicPlayerReady = true;
					MP.tj2rp.playerType = 3;
					return true;
				} else {
					MP.tj2rp.playerType = 0;
					return false;
				}
			} catch (e) {
				return false;
			}
		};

		function initFlash() {
			try {
				MP.addedPlayerDomain = true;
				MP.bUseBQQPlayer = false;
				MP.BQQPlayer = null;
				MP.MediaPlayer = null;
				MP.VH5Player = null;
				if (!MP.VFlashPlayer) MP.VFlashPlayer = new MP.FlashMusicPlayer();
				MP.VFlashPlayer.createActiveX(true, false, "flashmusicplayer", "0", "0", MP.PANEL_UIN_COOKIE_NAME, MP.PANEL_KEY_COOKIE_NAME, "http://www.qq.com");
				if (MP.VFlashPlayer.initialize()) {
					window.musicPlayerReady = true;
					MP.tj2rp.playerType = 4;
					return true;
				} else {
					MP.tj2rp.playerType = 0;
					return false;
				}
			} catch (e) {
				MP.console.print("init FlashPlayer Exp, e.message:", e.message);
				return false;
			}
		};
		if (!MP.getPlayer() || !window.musicPlayerReady) {
			if (( !! MP.userAgent.ie && MP.userAgent.ie > 6) || ( !! MP.userAgent && !! MP.userAgent.tt && MP.userAgent.tt >= 5 && !! MP.userAgent.chrome)) {
				if (!initQmp()) {
					if ( !! MP.userAgent.ie) {
						if (!initFlash()) {
							MP.console.print("init Flash error 1");
							MP.isNeedUpdatePlayer = true;
						}
					} else {
						if (!MP.userAgent.ttHtml5Audio) {
							if (!initFlash()) {
								MP.console.print("init Flash error 2");
								MP.isNeedUpdatePlayer = true;
							}
						} else {
							initH5Audio();
						}
					}
				}
			} else if ( !! MP.userAgent.chrome || !! MP.userAgent.safari) {
				if (/win/.test(navigator.platform.toLowerCase()) && !! ua.safari && !MP.getQuickTimePlugin()) {
					MP.showMsgbox('对不起，您需要先安装QuickTime才能播放音乐');
				}
				if (!initH5Audio()) {
					if (!initFlash()) {
						MP.console.print("init Flash error 3");
						MP.isNeedUpdatePlayer = true;
					}
				}
			} else {
				if (!initFlash()) {
					MP.console.print("init Flash error 4");
					MP.isNeedUpdatePlayer = true;
				}
			}
			window.musicPlayerReady = true;
			MP.console.print("initMusic 0, MP.addedPlayerDomain:", MP.addedPlayerDomain);
			if (!MP.addedPlayerDomain) {
				return false;
			}
			setTimeout(function() { !! cb && cb();
			}, 1000);
		} else { !! cb && cb();
		}
	};
	MP.isFirstPlaying = true;
	MP.setPlayProgressTime = function(pos) {
		try {
			MP.console.print("MP.setPlayProgressTime 1,pos:", pos);
			pos = parseInt(pos, 10);
			MP.console.print("MP.setPlayProgressTime 2,pos:", pos);
			if ( !! MP.BQQPlayer) {
				MP.BQQPlayer.mPlayerName.CurPos = pos;
			} else if ( !! MP.MediaPlayer) {
				if (MP.MediaPlayer.mPlayerName.currentMedia) {
					MP.BQpause();
					MP.MediaPlayer.mPlayerName.controls.currentPosition = pos;
					MP.BQplay();
				}
			} else if ( !! MP.VH5Player) {
				MP.console.print("MP.VH5Player.setPlayProgressTime 1,pos:", MP.VH5Player.mPlayerName.currentTime);
				MP.VH5Player.mPlayerName.currentTime = pos;
				MP.console.print("MP.VH5Player.setPlayProgressTime 2,pos:", pos);
			} else if ( !! MP.VFlashPlayer) {
				var oplay = MP.VFlashPlayer.mPlayerName;
				oplay.swfSeekMusic(pos);
			}
			MP.console.print("MP.setPlayProgressTime 6,pos:", pos);
		} catch (e) {
			MP.console.print("MP.setPlayProgressTime exp:", e.message);
		}
	};
	MP.getPlayProgress = function() {
		var obj = MP.getPlayer();
		if (!obj) {
			return {
				lCurPos: 0
			};
		}
		return {
			lCurPos: obj.mCurPlayPos
		};
	};
	MP.tj2rp = {
		_img: null,
		playerType: 0,
		arrayStatSong: [],
		_s: "",
		getRUin: function() {
			if (this._s.length > 0) {
				return this._s;
			}
			var u = MP.cookie.get("pgv_pvid");
			if ( !! u && u.length > 0) {
				this._s = u;
				return this._s;
			}
			var curMs = (new Date()).getUTCMilliseconds();
			this._s = (Math.round(Math.random() * 2147483647) * curMs) % 10000000000;
			document.cookie = "pgv_pvid=" + this._s + "; Expires=Sun, 18 Jan 2038 00:00:00 GMT; PATH=/; DOMAIN=" + document.domain + ";";
			return this._s;
		},
		statSong: function(songObj) {
			try {
				var m = MP.tj2rp,
					a = m.arrayStatSong;

				function sendStat(noTimeout) {
					noTimeout = noTimeout || false;
					var o = null,
						id = [],
						type = [],
						playtime = [],
						starttime = [],
						fromtag2 = [],
						count = a.length,
						i = 0;
					for (; i < count; i++) {
						o = a[i];
						id.push((parseInt(o.id) < 1 ? 0 : o.id));
						type.push(o.type || 0);
						playtime.push(o.playtime);
						starttime.push(o.starttime);
						fromtag2.push(o.fromtag2);
					}
					if (count > 0) {
						var statUrl = 'http://pt.music.qq.com/fcgi-bin/cgi_music_webreport.fcg?Count=' + count + '&Fqq=' + MP.user.getLoginUin() + '&Fguid=' + m.getRUin() + '&Ffromtag1=6&Ffromtag2=' + fromtag2.join(",") + '&Fsong_id=' + id.join(",") + '&Fplay_time=' + playtime.join(",") + '&Fstart_time=' + starttime.join(",") + '&Ftype=' + type.join(",") + '&Fversion=' + m.playerType;
						if (noTimeout) {
							(new Image()).src = statUrl;
						} else {
							MP.statImgSend(statUrl, 0);
						}
					}
					id = null;
					type = null;
					playtime = null;
					starttime = null;
					fromtag2 = null;
					m.arrayStatSong = [];
				};
				var len = a.length;
				if (len > 0) {
					a[len - 1].playtime = Math.ceil(MP.getPlayProgress().lCurPos);
					var obj = MP.getPlayer();
					if (obj) {
						obj.mCurPlayPos = 0;
					}
				}
				if (typeof(songObj) == "object" && songObj != null) {
					if (len == 5) {
						sendStat();
					}
					songObj.starttime = parseInt((new Date()).getTime() / 1000, 10);
					a.push(songObj);
				} else {
					sendStat(true);
				}
			} catch (e) {};
		},
		isNetUrl: function(url) {
			if (url.indexOf("music.qq.com") < 0) {
				return true;
			};
			return false;
		},
		isLocalUrl: function(url) {
			if (url.indexOf("streamrdt.music.qq.com") > -1) {
				return true;
			};
			return false;
		},
		isQusicUrl: function(url) {
			if (url.indexOf("qqmusic.qq.com") > -1) {
				return true;
			};
			return false;
		},
		getSongType: function(url) {
			return MP.tj2rp.isQusicUrl(url) ? 3 : (MP.tj2rp.isLocalUrl(url) ? 5 : 1);
		}
	};
	MP.media = {
		_flashVersion: null,
		getFlashHtml: function(flashArguments, requiredVersion, flashPlayerCID) {
			var _attrs = [],
				_params = [];
			for (var k in flashArguments) {
				switch (k) {
					case "noSrc":
					case "movie":
						continue;
						break;
					case "id":
					case "name":
					case "width":
					case "height":
					case "style":
						if (typeof(flashArguments[k]) != 'undefined') {
							_attrs.push(' ', k, '="', flashArguments[k], '"');
						}
						break;
					case "src":
						if (MP.userAgent.ie) {
							_params.push('<param name="movie" value="', (flashArguments.noSrc ? "" : flashArguments[k]), '"/>');
						} else {
							_attrs.push(' data="', (flashArguments.noSrc ? "" : flashArguments[k]), '"');
						}
						break;
					default:
						_params.push('<param name="', k, '" value="', flashArguments[k], '" />');
				}
			}
			if (MP.userAgent.ie) {
				_attrs.push(' classid="clsid:', flashPlayerCID || 'D27CDB6E-AE6D-11cf-96B8-444553540000', '"');
			} else {
				_attrs.push(' type="application/x-shockwave-flash"');
			}
			if (requiredVersion && (requiredVersion instanceof MP.media.SWFVersion)) {
				_attrs.push(' codeBase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=', requiredVersion, '"');
			}
			return "<object" + _attrs.join("") + ">" + _params.join("") + "</object>";
		}
	};
	MP.media.SWFVersion = function() {
		var a;
		if (arguments.length > 1) {
			a = arg2arr(arguments);
		} else if (arguments.length == 1) {
			if (typeof(arguments[0]) == "object") {
				a = arguments[0];
			} else if (typeof arguments[0] == 'number') {
				a = [arguments[0]];
			} else {
				a = [];
			}
		} else {
			a = [];
		}
		this.major = parseInt(a[0], 10) || 0;
		this.minor = parseInt(a[1], 10) || 0;
		this.rev = parseInt(a[2], 10) || 0;
		this.add = parseInt(a[3], 10) || 0;
	};
	var arg2arr = function(refArgs, start) {
		if (typeof start == 'undefined') {
			start = 0;
		}
		return Array.prototype.slice.apply(refArgs, [start, refArgs.length]);
	}
}); /*  |xGv00|9c7656f9208be1ebcb3d7b89c984aeac */