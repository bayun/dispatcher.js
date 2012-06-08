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
			while (ns = nss.shift()) {
				node = { cb: callback, ct: context, ev: event + ":", id: this.c, n: cbs.n };
				cbs.n = node;
				cbs = cbs.c[ns] = cbs.c[ns] || {cbs:[], c:{}};
			}
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
			while (ns = nss.shift()) {
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
				nss.length ? delete cbs.c[ns] : cbs = cbs.c[ns];
			}
		}
		return this;
	}

	this.trigger = function(events, a,b,c,d,e,f,g,h,i,j,k,l,m,n,o) {
		
		var event, ev1, args, nss, cbs, fire, cb, ns, ind, found, evs;
		evs = events.split(/\s+/);
//		args = arguments;
//		args = Array.prototype.slice(arguments, 1);
		args = ['',a,b,c,d,e,f,g,h,i,j,k,l,m,n,o];
		fire = []; found = {};
		while (args[0] = event = evs.shift()) {
			nss = event.split(':');
			event += ":";
			cbs = this._cbs;
			while (cbs && (ns = nss.shift())) {
				for (cb = cbs.n; cb; cb = cb.n) {
					if (!found[cb.id] && event.lastIndexOf(cb.ev, 0) === 0) {
						fire.push(cb);
						found[cb.id] = 1;
					}
				}
				cbs = cbs.c[ns]
			}
			found = 0;
			for (ind = 0; ind < fire.length; ++ind) {
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
