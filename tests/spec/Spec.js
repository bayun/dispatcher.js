describe("Mediator", function() {
	var d;

	beforeEach(function() {
		d = new Dispatcher();
	});

	describe("test", function(){
		it("checks simple event subscribe/trigger", function(){
			var spy = jasmine.createSpy("test callback");
			var spy2 = jasmine.createSpy("callback2");
			d.on("x", spy);
			d.on("y", spy2);
			d.trigger("x");

			expect(spy).toHaveBeenCalled();
			expect(spy2).not.toHaveBeenCalled();
		});

		it("unsubscribes handler for simple event", function() {
			var spy = jasmine.createSpy("test callback");
			var spy2 = jasmine.createSpy("test callback2");
			d.on("x", spy);
			d.on("y", spy2);
			d.off("x", spy);
			d.trigger("x");
			d.trigger("y");

			expect(spy).not.toHaveBeenCalled();
			expect(spy2).toHaveBeenCalled();
		})
		
		it("passes arguments to callback", function(){
			var spy = jasmine.createSpy("test callback");
			d.on("x", spy);
			d.trigger("x", "a", "b", "c");
			expect(spy).toHaveBeenCalledWith("x", "a", "b", "c");
		})
		
		it("invokes callback in given context", function(){
			var callback = function() {
				this.v = 0;
			};
			var context = {v : 144};
			d.on("x", callback, context);
			d.trigger("x");
			expect(context.v).toBe(0);
		});
		
		it("subscribes callback to several events at once", function() {
			var spy = jasmine.createSpy("test callback");
			var spy2 = jasmine.createSpy("callback2");
			d.on("x y", spy);
			d.on("z", spy2);
			d.trigger("x");
			d.trigger("y");

			expect(spy.callCount).toEqual(2);
			expect(spy2).not.toHaveBeenCalled();
		})
		
		it("triggers namespaced event and calls callback on event and namespace", function() {
			var spy = jasmine.createSpy("test callback");
			var spy2 = jasmine.createSpy("callback2");
			d.on("x", spy);
			d.on("z", spy2);
			d.trigger("x:y");
			d.trigger("x");

			expect(spy.callCount).toEqual(2);
			expect(spy2).not.toHaveBeenCalled();
		})
		
		it("triggers namespaced event and calls callback on higher (but non-root) namespace", function() {
			var spy = jasmine.createSpy("test callback");
			d.on("x:y:z", spy);
			d.trigger("x:y:z:X");

			expect(spy.callCount).toEqual(1);
		})
		
		it("tries to remove handlers from child namespace", function(){
			var spy = jasmine.createSpy("test callback");
			d.on("x:y:z", spy);
			d.off("x:y", spy);
			d.trigger("x:y:z:X");

			expect(spy).toHaveBeenCalled();
		})
		
		it("removes handler from namespace", function(){
			var spy = jasmine.createSpy("test callback");
			d.on("x:y:z", spy);
			d.off("x:y:z", spy);
			d.trigger("x:y:z:X");

			expect(spy).not.toHaveBeenCalled();
		})
		
		it("removes handlers from namespace", function(){
			var spy = jasmine.createSpy("test callback");
			d.on("x:y:z", spy);
			d.off("x:y:z");
			d.trigger("x:y:z:X");

			expect(spy).not.toHaveBeenCalled();
		})
		
		it("stops handler calls if handler returns false", function() {
			var obj = {};
			var spyX = jasmine.createSpy("x callback");
			var spyXY1 = jasmine.createSpy("x:y callback1").andReturn(false);
			var spyXY2 = jasmine.createSpy("x:y callback2");
			var spyXYZ = jasmine.createSpy("x:y:z callback");

			d.on("x", spyX);
			d.on("x:y", spyXY1);
			d.on("x:y", spyXY2);
			d.on("x:y:z", spyXYZ);
			d.trigger("x:y:z");
			
			expect(spyX).not.toHaveBeenCalled();
			expect(spyXY1).toHaveBeenCalled();
			expect(spyXY2).toHaveBeenCalled();
			expect(spyXYZ).toHaveBeenCalled();
			
		})
		
	});
});
