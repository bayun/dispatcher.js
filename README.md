dispatcher.js
=============

Version 0.5.0

Extremally small implementation of event dispatcher with namespace support.

Basic usage
-----------
* add handler for event:

		function foo(eventName) { 
			console.log("events is" + eventName);
		} 
		var d = new Dispatcher; 
		d.on("eventName", handler);

* supply context for handler call:

		d.on("eventName", handler, this);

* remove event handler (arguments must be same as when adding it):

		d.off("eventName", handler, this);

* trigger event, optionally - with additional arguments that will be passed to handlers:

		d.trigger("eventName"); 
		d.trigger("eventName", "arg", "arg2");

Namespaces
----------

Events can be namespaced using ":" like "foo:bar:baz". Then you can listen on first part and receive all events that are contained in this namespace. Handler always receives full event name as first argument.

* Subscribe to namespace:

		d.on("foo", handler); 
		// this will trigger handler, as usual 
		d.trigger("foo"); 
		// this will also trigger it d.trigger("foo:bar"); 
		// and this will also trigger it 
		d.trigger("foo:bar:baz")

* Unsubscribe all handlers for given namespace:

		d.off("foo:bar")
