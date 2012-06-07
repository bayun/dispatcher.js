function Dispatcher() {
	this._cbs = {cbs:[], c:{}};
	this.counter = 1;

	this.on = this.bind = function(events, callback, context) {
		if (!callback) throw "bad callback";
		events = events.split(/\s+/);
		var event, nss, ns, node, cbs;
		while (event = events.shift()) {
			node = { cb: callback, ct: context, ev: event + ":", id: this.counter };
			nss = event.split(':');
			cbs = this._cbs;
			while (ns = nss.shift()) {
				cbs.cbs.push(node);
				cbs = cbs.c[ns] = cbs.c[ns] || {cbs:[], c: {}};
			}
		}
		++this.counter;
	}

	this.off = this.unbind = function (events, callback, context) {
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
				if (!nss.length)
					delete cbs.c[ns];
				else
					cbs = cbs.c[ns] || null;
			}
		}
	}

	this.trigger = function(events) {
		
		var event, args, nss, cbs, fire, ns, i, found, evs, status;
		evs = events.split(/\s+/);
		args = arguments;
		fire = []; found = {};
		while (args[0] = event = evs.shift()) {
			nss = event.split(':');
			event += ":";
			cbs = this._cbs;
			while (cbs && (ns = nss.shift())) {
				for (i = 0; i < cbs.cbs.length; ++i) {
					if (!found[cbs.cbs[i].id] && event.lastIndexOf(cbs.cbs[i].ev, 0) === 0) {
						fire.push(cbs.cbs[i]);
						found[cbs.cbs[i].id] = 1;
					}
				}
				cbs = cbs.c[ns] || null;
			}
			found = 0;
			for (i = fire.length - 1; i>= 0; --i) {
				if (found && fire[i].ev.length != found)
					break;
				if (fire[i].cb.apply(fire[i].ct || this, args) === false) {
					found = fire[i].ev.length;
				}
			}
		}
	}
}
