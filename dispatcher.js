function Dispatcher() {
	this._cbs = {c:{}};

	this.on = function(events, callback, context) {
		if (!callback) throw "bad callback";
		events = events.split(/\s+/);
		var event, nss, ns, cbs;
		while (event = events.shift()) {
			nss = event.split(':');
			cbs = this._cbs;
			while(ns = nss.shift()) {
				cbs = cbs.c[ns] = cbs.c[ns] || {c:{}};
			}
			cbs.n = { cb: callback, ct: context, n: cbs.n };
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
			head = cbs.n;
			while(head) {
				if ((!callback || head.cb === callback) && head.ct === context) {
					if (!prev) {
						head = cbs.n = head.n;
					}
					else
						head = prev.n = head.n;
				} else {
					prev = head;
					head = head.n;
				}
			}
		}
		return this;
	}

	this.trigger = function(events, a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) {
		var args, nss, cbs, fire, cb, ns, ind, found, evs;
		evs = events.split(/\s+/);
		args = ["", a,b,c,d,e,f,g,h,i,j,k,l,m,n,o];
		fire = [];
		while (args[0] = nss = evs.shift()) {
			nss = nss.split(':');
			cbs = this._cbs;
			while((ns = nss.shift()) && (cbs = cbs.c[ns])) {
				for (cb = cbs.n; cb; cb = cb.n) {
					fire.push(cb);
				}
				fire.push(0);
			}
			found = 0;
			for (ind = fire.length - 1; ind >= 0; --ind) {
				cb = fire[ind];
				if (!cb) {
					if (found)
						break;
				} else {
					if (cb.cb.apply(cb.ct || this, args) === false) {
						found = 1;
					}
				}
			}
		}
		return this;
	}
}
