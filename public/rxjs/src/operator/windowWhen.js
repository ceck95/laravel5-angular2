System.register(['../Subject', '../util/tryCatch', '../util/errorObject', '../OuterSubscriber', '../util/subscribeToResult'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Subject_1, tryCatch_1, errorObject_1, OuterSubscriber_1, subscribeToResult_1;
    var WindowOperator, WindowSubscriber;
    /**
     * Branch out the source Observable values as a nested Observable using a
     * factory function of closing Observables to determine when to start a new
     * window.
     *
     * <span class="informal">It's like {@link bufferWhen}, but emits a nested
     * Observable instead of an array.</span>
     *
     * <img src="./img/windowWhen.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits connected, non-overlapping windows.
     * It emits the current window and opens a new one whenever the Observable
     * produced by the specified `closingSelector` function emits an item. The first
     * window is opened immediately when subscribing to the output Observable.
     *
     * @example <caption>Emit only the first two clicks events in every window of [1-5] random seconds</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks
     *   .windowWhen(() => Rx.Observable.interval(1000 + Math.random() * 4000))
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @see {@link window}
     * @see {@link windowCount}
     * @see {@link windowTime}
     * @see {@link windowToggle}
     * @see {@link bufferWhen}
     *
     * @param {function(): Observable} closingSelector A function that takes no
     * arguments and returns an Observable that signals (on either `next` or
     * `complete`) when to close the previous window and start a new one.
     * @return {Observable<Observable<T>>} An observable of windows, which in turn
     * are Observables.
     * @method windowWhen
     * @owner Observable
     */
    function windowWhen(closingSelector) {
        return this.lift(new WindowOperator(closingSelector));
    }
    exports_1("windowWhen", windowWhen);
    return {
        setters:[
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            },
            function (tryCatch_1_1) {
                tryCatch_1 = tryCatch_1_1;
            },
            function (errorObject_1_1) {
                errorObject_1 = errorObject_1_1;
            },
            function (OuterSubscriber_1_1) {
                OuterSubscriber_1 = OuterSubscriber_1_1;
            },
            function (subscribeToResult_1_1) {
                subscribeToResult_1 = subscribeToResult_1_1;
            }],
        execute: function() {
            WindowOperator = (function () {
                function WindowOperator(closingSelector) {
                    this.closingSelector = closingSelector;
                }
                WindowOperator.prototype.call = function (subscriber, source) {
                    return source._subscribe(new WindowSubscriber(subscriber, this.closingSelector));
                };
                return WindowOperator;
            }());
            /**
             * We need this JSDoc comment for affecting ESDoc.
             * @ignore
             * @extends {Ignored}
             */
            WindowSubscriber = (function (_super) {
                __extends(WindowSubscriber, _super);
                function WindowSubscriber(destination, closingSelector) {
                    _super.call(this, destination);
                    this.destination = destination;
                    this.closingSelector = closingSelector;
                    this.openWindow();
                }
                WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
                    this.openWindow(innerSub);
                };
                WindowSubscriber.prototype.notifyError = function (error, innerSub) {
                    this._error(error);
                };
                WindowSubscriber.prototype.notifyComplete = function (innerSub) {
                    this.openWindow(innerSub);
                };
                WindowSubscriber.prototype._next = function (value) {
                    this.window.next(value);
                };
                WindowSubscriber.prototype._error = function (err) {
                    this.window.error(err);
                    this.destination.error(err);
                    this.unsubscribeClosingNotification();
                };
                WindowSubscriber.prototype._complete = function () {
                    this.window.complete();
                    this.destination.complete();
                    this.unsubscribeClosingNotification();
                };
                WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
                    if (this.closingNotification) {
                        this.closingNotification.unsubscribe();
                    }
                };
                WindowSubscriber.prototype.openWindow = function (innerSub) {
                    if (innerSub === void 0) { innerSub = null; }
                    if (innerSub) {
                        this.remove(innerSub);
                        innerSub.unsubscribe();
                    }
                    var prevWindow = this.window;
                    if (prevWindow) {
                        prevWindow.complete();
                    }
                    var window = this.window = new Subject_1.Subject();
                    this.destination.next(window);
                    var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
                    if (closingNotifier === errorObject_1.errorObject) {
                        var err = errorObject_1.errorObject.e;
                        this.destination.error(err);
                        this.window.error(err);
                    }
                    else {
                        this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
                        this.add(window);
                    }
                };
                return WindowSubscriber;
            }(OuterSubscriber_1.OuterSubscriber));
        }
    }
});
//# sourceMappingURL=windowWhen.js.map