function Dispatcher() {
	this._cbs = {c:{}, cbs:[]};

	this.on = function(events, callback, context) {
		if (!callback) throw "bad callback";
		events = events.split(/\s+/);
		var event, nss, ns, cbs;
		while (event = events.shift()) {
			nss = event.split(':');
			cbs = this._cbs;
			while(ns = nss.shift()) {
				if (!cbs.c[ns])
					cbs.c[ns] = {c:{}, cbs:[]};
				cbs = cbs.c[ns];
			}
			cbs.cbs.push({ cb: callback, ct: context});
		}
		return this;
	}

	this.off = function (events, callback, context) {
		var nss, ns, cbs, cb, head, prev;
		events = events.split(/\s+/);
		while (nss = events.shift()) {
			nss = nss.split(':');
			cbs = this._cbs;
			while((ns = nss.shift()) && (cbs = cbs.c[ns])) {
			}
			if (!callback) {
				cbs.cbs = [];
			} else {
				head = [];
				for(var i = cbs.cbs.length - 1; i > -1; --i) {
					if (cbs.cbs[i].cb !== callback || cbs.cbs[i].ct !== context) {
						head.push(cbs.cbs[i]);
					}
				}
				cbs.cbs = head;
			}
		}
		return this;
	}

	this.trigger = function(events, a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) {
		var args, nss, cbs, fire, cb, ns, ind, stop, evs;
		evs = events.split(/\s+/);
		args = ["", a,b,c,d,e,f,g,h,i,j,k,l,m,n,o];
		fire = [];
		while (args[0] = nss = evs.shift()) {
			nss = nss.split(':');
			cbs = this._cbs;
			while((ns = nss.shift()) && (cbs = cbs.c[ns])) {
				fire = fire.concat(cbs.cbs);
				fire.push(0);
			}
			stop = 0;
			for (ind = fire.length - 2; ind > -1; --ind) {
				cb = fire[ind];
				if (!cb) {
					if (stop)
						break;
				} else {
					if (cb.cb.apply(cb.ct || this, args) === false)
						stop = 1;
				}
			}
		}
		return this;
	}
}
