function Dispatcher() {
	this._cbs = {cbs:[], c:{}};
	this.c = 1;

	this.on = function(events, callback, context) {
		if (!callback) throw "bad callback";
		events = events.split(/\s+/);
		var event, nss, ns, node, cbs;
		while (event = events.shift()) {
			node = { cb: callback, ct: context, ev: event + ":", id: this.c };
			nss = event.split(':');
			cbs = this._cbs;
			while (ns = nss.shift()) {
				cbs.cbs.push(node);
				cbs = cbs.c[ns] = cbs.c[ns] || {cbs:[], c: {}};
			}
		}
		++this.c;
	}

	this.off = function (events, callback, context) {
		var nss, cbs = true, alive, ns, cb, ev;
		events = events.split(/\s+/);
		while (cbs && (ev = events.shift())) {
			nss = ev.split(':');
			ev += ':';
			cbs = this._cbs;
			while (ns = nss.shift()) {
				alive = [];
				while(cb = cbs.cbs.shift()) {
					if ((callback && cb.cb != callback) || cb.ev != ev || cb.ct != context)
						alive.push(cb);
				}
				cbs.cbs = alive;
				nss.length ? delete cbs.c[ns] : cbs = cbs.c[ns];
			}
		}
	}

	this.trigger = function(events) {
		
		var event, args, nss, cbs, fire, cb, ns, i, found, evs;
		evs = events.split(/\s+/);
		args = arguments;
		fire = []; found = {};
		while (args[0] = event = evs.shift()) {
			nss = event.split(':');
			event += ":";
			cbs = this._cbs;
			while (cbs && (ns = nss.shift())) {
				for (i = 0; i < cbs.cbs.length; ++i) {
					cb = cbs.cbs[i];
					if (!found[cb.id] && event.lastIndexOf(cb.ev, 0) === 0) {
						fire.push(cb);
						found[cb.id] = 1;
					}
				}
				cbs = cbs.c[ns]
			}
			found = 0;
			for (i = fire.length - 1; i>= 0; --i) {
				cb = fire[i];
				if (found && cb.ev.length != found)
					break;
				if (cb.cb.apply(cb.ct || this, args) === false) {
					found = cb.ev.length;
				}
			}
		}
	}
}
