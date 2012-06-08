function Dispatcher() {
	this._cbs = {cbs:[], c:{}};
	this.c = 1;

	this.on = function(events, callback, context) {
		if (!callback) throw "bad callback";
		events = events.split(/\s+/);
		var event, nss, ns, node, cbs;
		while (event = events.shift()) {
			
			nss = event.split(':');
			cbs = this._cbs;
			while(ns = nss.shift()) {
				cbs = cbs.c[ns] = cbs.c[ns] || {cbs:[], c:{}};
			}
			node = { cb: callback, ct: context, ev: event + ":", id: this.c, n: cbs.n };
			cbs.n = node;
		}
		++this.c;
		return this;
	}

	this.off = function (events, callback, context) {
		var nss, cbs = true, alive, ns, cb, ev, head, prev;
		events = events.split(/\s+/);
		while (cbs && (ev = events.shift())) {
			nss = ev.split(':');
			ev += ':';
			cbs = this._cbs;
			while(ns = nss.shift()) {
				cbs = cbs.c[ns] = cbs.c[ns] || {cbs:[], c:{}};
			}
			head = cbs.n;
				while(head) {
					if ((!callback || head.cb == callback) && head.ev == ev && head.ct == context) {
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
		
		var event, ev1, args, nss, cbs, fire, cb, ns, ind, found, evs;
		evs = events.split(/\s+/);
//		args = arguments;
		args = ['',a,b,c,d,e,f,g,h,i,j,k,l,m,n,o];
		fire = []; found = {};
		while (args[0] = event = evs.shift()) {
			nss = event.split(':');
			event += ":";
			cbs = this._cbs;
			while(ns = nss.shift(), cbs = cbs.c[ns]) {
				for (cb = cbs.n; cb; cb = cb.n) {
					fire.push(cb);
				}
			}
			found = 0;
			for (ind = fire.length - 1; ind >= 0; --ind) {
				cb = fire[ind];
				if (found && cb.ev.length != found)
					break;
				if (cb.cb.apply(cb.ct || this, args) === false) {
					found = cb.ev.length;
				}
			}
		}
		return this;
	}
}
