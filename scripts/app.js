let app = angular.module('hotel-booking', ['720kb.tooltips', 'vesparny.fancyModal'])
.factory('Data', function($http) {
    // make an ajax request using $http
    return __suitesInfo;
})
.factory('User', function($http) {
    var obj = {};
    Object.defineProperty(obj, 'sendData',
    {
        writable: false,
        value: sendData
    });
    Object.defineProperty(obj, 'data',
    {
        writable: false,
        value: {}
    });
    function sendData()
    {
        // send data to server
    }
    return obj;
})
.directive('bindElementItem', function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            scope.bindItemToElement(element, scope.room, scope.date);
        }
    };
})
.directive('setDataTableWrap', function() {
    return {
        restrict: "A",
        link: function(scope, element, attr) {
            scope.dataTableWrap = element;
        }
    };
})
.directive('enterPressExec', function() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("keydown keypress", function ($event) {
                $event._preventDefault = true;
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.enterPressExec, { $event: $event });
                    });

                    if (!$event._preventDefault)
                        debugger;
                    if ($event._preventDefault)
                        $event.preventDefault();
                }
            });
        }
    };
})
// | filter : 'Floor: ' + filter.storey | filter : filter.byPriceRange
.controller('mainController', function($scope, $window, $fancyModal, $sce, Data, User) {
    $scope.stateEnum = {
        ROOM: 1,
        FORM: 2,
        FINISH: 3
    };
    hints = ["Select rooms you want to book. Click on preferable date. Try dragging ;)", "Enter your personal data", "Congratulations!"];
    let viewState;
    function setState(value) {
        viewState = value;
        $scope.hint = hints[value - 1];
        $window.scrollTo(0, 0);
    }
    setState($scope.stateEnum.ROOM);
    Object.defineProperty($scope, 'getState', {
		writable: false,
		value: function() {
			return viewState;
		}
    });
    $scope.goto = function(state) {
        if (viewState > state)
            setState(state);
    };


    //// BOOK

    $scope.showInfo = function(info) {
        $fancyModal.open({ template: '<div>' + info + '</div>' });
    };

    const data = Data;
    const noBooked = "You haven't booked anything yet.";
    const totalMsg = ["Total sum: ", "$."];
    $scope.dateRange = (function (dateLimits)
    {
        let dateRange = [];
        let lastDate;
        if (!isValidDate(lastDate = new Date(dateLimits[1])))
        {
            return dateRange;
        }
        let firstDate;
        if (!isValidDate(firstDate = new Date(dateLimits[0])))
        {
            firstDate = new Date();
            firstDate.setDate(firstDate.getDate() + 1);
        }

        for (let i = firstDate; i <= lastDate; i.setDate(i.getDate() + 1))
        {
            dateRange.push(new Date(i.getTime()));
        }
        return dateRange;

        function isValidDate(dateObj)
        {
            return Object.prototype.toString.call(dateObj) === "[object Date]" && !isNaN(dateObj.valueOf());
        }
    })(data.dateLimits);
    $scope.formatDate = function(date)
    {
        let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
    };
    $scope.rooms = data.rooms;
    Object.defineProperty($scope, "roomTypes", {
        value: data.roomsTypes,
        writable: false
    });
    
    const userInfo = [];
    const bookedRooms = [];
    bookedRooms.makeBookingItem = function(room, date)
    {
        var item = {};
        Object.assign(item, room);
        item.date = date;
        return item;
    };
    $scope.bindItemToElement = function (element, room, date)
    {
        let item = bookedRooms.makeBookingItem(room, date);
        $(element).data("item", item);
    };
    bookedRooms.tryAdd = function(room, date)
    {
        let item;
        if (room.date)
            item = room;
        else
            item = this.makeBookingItem(room, date);
        if (this.indexOf(item) >= 0)
            return false;
        this.push(item);
        return true;
    };
    bookedRooms.tryRemove = function(room, date)
    {
        let item;
        if (room.date)
            item = room;
        else
            item = this.makeBookingItem(room, date);
        let index = this.indexOf(item);
        if (index < 0)
            return false;
        if (index < this.length - 1)
            this[index] = this.pop();
        else
            this.pop();
        return true;
    };
    data.rooms.compare = function(item1, item2) {
        return item1.type == item2.type && item1.storey == item2.storey && item1.number == item2.number && item1.price == item2.price
            && item1.description == item2.description;
    };
    bookedRooms.compare = function(item1, item2) {
        return data.rooms.compare(item1, item2) && item1.date.getDate() == item2.date.getDate() &&
            item1.date.getMonth() == item2.date.getMonth() && item1.date.getFullYear() == item2.date.getFullYear();
    };
    bookedRooms.indexOf = function(item)
    {
        for (var i = 0; i < this.length; i++)
        {
            if (this.compare(this[i], item))
                return i;
        }
        return -1;
    };
    
    $scope.selectingClass = 'choosing';    
    $scope.selectedClass = 'chosen';
    $scope.bookedClass = 'booked';
    $scope.defaultClass = 'default';
    const ColoringEnum = {
        DEFAULT: $scope.defaultClass,
        SELECTING: $scope.selectingClass,
        SELECTED: $scope.selectedClass,
        BOOKED: $scope.bookedClass
    };
    $scope.colorPatternClass = "color-pattern";
    $scope.colorsInfo = "<div>Free: <span class='"+$scope.colorPatternClass +" "+ColoringEnum.DEFAULT+"'></span></div>" +
        "<div>Occupied: <span class='"+$scope.colorPatternClass +" "+ColoringEnum.BOOKED+"'></span></div>" +
        "<div>Chosen by user: <span class='"+$scope.colorPatternClass +" "+ColoringEnum.SELECTED+"'></span></div>";
    data.booked.contains = function(room, date) {
        let item = date ? this.makeBookingItem(room, date) : room;
        for (let i = 0; i < this.length; i++)
            if (this.compare(this[i], item))
                return true;
        return false;
    };
    $scope.isBooked = data.booked.contains.bind(data.booked);
    data.booked.compare = bookedRooms.compare;
    data.booked.makeBookingItem = bookedRooms.makeBookingItem;

    let buttonPressed = false;
    let removing = false;
    let temp = [];
    temp.originIndex = 0;
    temp.minIndex = 0;
    temp.maxIndex = 0;
    let cells;
    $scope.dataTableWrap = null;
    $scope.mouseMove = function(e)
    {
        if (!(buttonPressed && $scope.dataTableWrap))
            return;
        let table = $($scope.dataTableWrap);
        let xPointerPos = e.pageX - table.offset().left;
        if (xPointerPos < 0)
            table.scrollLeft(table.scrollLeft() + xPointerPos / 5);
        else if(xPointerPos > table.width())
            table.scrollLeft(table.scrollLeft() + xPointerPos / 120);
    };
    $scope.mouseEventHandler = function(type, event)
    {
        if (event.originalEvent)
            event = event.originalEvent;
        return {
            'down': function(e) {
                if (buttonPressed)
                    return;
                let td = getTdParent(e.srcElement);
                let item = $(td).data("item");
                if (data.booked.contains(item))
                    return;
                cells = td.parentNode.childNodes;
                temp.originIndex = temp.maxIndex = temp.minIndex = Array.prototype.slice.call(cells).indexOf(td);
                temp[temp.originIndex] = item;
                buttonPressed = true;
                removing = bookedRooms.indexOf(item) >= 0;
                mark(td, ColoringEnum.SELECTING);
            },
            'move': function(e) {
                if (buttonPressed)
                {
                    let index = Array.prototype.slice.call(cells).indexOf(getTdParent(e.srcElement));
                    if (index < 0)
                        return;
                    let iterationStart, iterationEnd, startDate, addElementsToTemp = true, changeTempProps = function() {};
                    let increasing = true;
                    if (index < temp.minIndex)
                    {
                        increasing = false;
                        iterationStart = temp.minIndex - 1;
                        iterationEnd = index;
                        changeTempProps = function() { temp.minIndex = index; };
                    }
                    else if (index > temp.maxIndex)
                    {
                        iterationStart = temp.maxIndex + 1;
                        iterationEnd = index;
                        changeTempProps = function() { temp.maxIndex = index; };
                    }
                    else if (index > temp.minIndex && index <= temp.originIndex)
                    {
                        increasing = false;
                        iterationStart = index - 1;
                        iterationEnd = temp.minIndex;
                        addElementsToTemp = false;
                        changeTempProps = function() { temp.minIndex = index; };
                    }
                    else if (index >= temp.originIndex && index < temp.maxIndex)
                    {
                        iterationStart = index + 1;
                        iterationEnd = temp.maxIndex;
                        addElementsToTemp = false;
                        changeTempProps = function() { temp.maxIndex = index; }
                    }
                    if (!(iterationStart && iterationEnd))
                        return;
                    function iteration(i, currDate, check = true) {
                        if (addElementsToTemp)
                        {
                            if (cells[i].nodeName != "TD")
                                return true;
                            let item = $(cells[i]).data("item");
                            if (check && (data.booked.contains(item) || removing && bookedRooms.indexOf(item) < 0 ||
                                !removing && bookedRooms.indexOf(item) >= 0))
                            {
                                return false;
                            }
                            temp[i] = item;
                            mark(cells[i], ColoringEnum.SELECTING);
                            return true;
                        }
                        else
                        {
                            if (cells[i].nodeName != "TD")
                                return true;
                            delete temp[i];
                            mark(cells[i], removing ? ColoringEnum.SELECTED : ColoringEnum.DEFAULT);
                            return true;
                        }
                    }
                    if (increasing)
                    {
                        for (let i = iterationStart; i <= iterationEnd; i++)
                        {
                            if (!iteration(i))
                                return;
                        }
                    }
                    else
                    {
                        for (let i = iterationStart; i >= iterationEnd; i--)
                        {
                            if (!iteration(i))
                                return;
                        }
                    }
                    changeTempProps();
                }
            },
            'up': function(e) {
                buttonPressed = false;
                if (!removing)
                {
                    for (let i = temp.minIndex; i <= temp.maxIndex; i++)
                    {
                        if (!temp[i])
                            continue;
                        bookedRooms.tryAdd(temp[i]);
                        mark(cells[i], ColoringEnum.SELECTED);
                    }
                }
                else
                {
                    for (let i = temp.minIndex; i <= temp.maxIndex; i++)
                    {
                        if (!temp[i])
                            continue;
                        bookedRooms.tryRemove(temp[i]);
                        mark(cells[i], ColoringEnum.DEFAULT);
                    }
                }
                let dates = "";
                for (let i = 0; i < bookedRooms.length; i++)
                    dates += bookedRooms[i].date + "::";
                temp.length = 0;
                updateBookedDisplay();
            }
        }[type](event);
        function mark(el, className)
        {
            el = getTdParent(el);
            let list = el.classList;
            for (let prop in ColoringEnum)
                if (list.contains(ColoringEnum[prop]))
                {
                    list.remove(ColoringEnum[prop]);
                    break;
                }
            if (className)
                list.add(className)
        }
        function getTdParent(el)
        {
            while(el.nodeName != "TD")
            {
                if (el.nodeName == "HTML")
                    throw new Error("Can't find td element");
                el = el.parentNode;
            }
            return el;
        }
    };
    $scope.bookedMsg = noBooked;
    $scope.bookedDetails = noBooked;
    function updateBookedDisplay()
    {
        if (bookedRooms.length == 0)
        {
            $scope.bookedDetails = $scope.bookedMsg = noBooked;
            return;
        }
        let sum = 0;
        let groupedBookings = {
            collection: [],
            add: function(item) {
                for (let i = 0; i < this.collection.length; i++)
                    if (data.rooms.compare(item, this.collection[i]))
                    {
                        for (let j = 0; j < this.collection[i].dates.length; j++)
                        {
                            if (this.collection[i].dates[j] > item.date)
                            {
                                this.collection[i].dates.splice(j, 0, item.date);
                                return;
                            }
                        }
                        this.collection[i].dates.push(item.date);
                        return;
                    }
                let newItem = {};
                Object.assign(newItem, item);
                newItem.dates = [item.date];
                this.collection.push(newItem);
            }
        };
        for (let i = 0; i < bookedRooms.length; i++)
        {
            groupedBookings.add(bookedRooms[i]);
            sum += bookedRooms[i].price;
        }
        $scope.bookedMsg = totalMsg.join(sum);
        let details = "<ul>", col = groupedBookings.collection;
        for (let i = 0; i < col.length; i++)
        {
            details += "<li>";
            details += "<div><strong>Room number: </strong>" + col[i].number + "</div>" +
                "<div><strong>Floor: </strong>" + col[i].storey + "</div>" +
                "<div><strong>Type: </strong>" + data.roomsTypes[col[i].type] + "</div>" +
                "<div><strong>Price: </strong>" + col[i].price + "</div>" +
                "<div><strong>Dates: </strong>" + (function(dates) {
                    let str = "<ul>";
                    for (let i = 0; i < dates.length; i++)
                    {
                        str += "<li>" + $scope.formatDate(dates[i]) + "</li>";
                    }
                    return str + "</ul>";
                })(col[i].dates) + "</div>" +
                "<div><strong>Description: </strong>" + col[i].description + "</div>";
        }
        $scope.bookedDetails = details + "</ul>";
    }
    $scope.bookedCount = function()
    {
        return bookedRooms.length;
    };
    $scope.bookingFinish = function()
    {
        User.booked = bookedRooms;
        setState($scope.stateEnum.FORM);
    };

    $scope.filters = {
        sample: {},
        minPrice: undefined,
        maxPrice: undefined,
        byPriceRange: function() {
            return (item) => !this.minPrice || !this.maxPrice || item.price >= this.minPrice && item.price <= this.maxPrice;
        }
    };

    $scope.availableFloors = [];
    $scope.filters.minPrice = Number.MAX_VALUE;
    $scope.filters.maxPrice = Number.MIN_VALUE;
    for (let i = 0; i < Data.rooms.length; i++)
    {
        $scope.filters.minPrice = Math.min(Data.rooms[i].price, $scope.filters.minPrice);
        $scope.filters.maxPrice = Math.max(Data.rooms[i].price, $scope.filters.maxPrice);
        if ($scope.availableFloors.indexOf(Data.rooms[i].storey) < 0)
            $scope.availableFloors.push(Data.rooms[i].storey);
    }
    $scope.availableFloors.sort();
    //// FORM 
    $scope.name = "";
    $scope.email = "";
    $scope.is18 = false;
    $scope.namePattern = /[A-Z]([a-zA-Z\-'])+/;
    $scope.formSubmit = function () {
        User.data.name = $scope.name;
        User.data.email = $scope.email;
        displayFinalScreen();
    };
    $scope.enterPressed = function(e) {
        let controls = $(e.target.form).find(":input, :button"), found = false;
        for (let i = 0; i < controls.length; i++)
        {
            let elem = $(controls[i]);
            if (controls[i] == e.target)
            {
                found = true;
                if (elem.attr('type') == 'checkbox' && controls[i].checked == false)
                    elem.click();
                continue;
            }
            if (found)
            {
                if (elem.attr('type') == 'submit' || controls[i].tagName == "BUTTON")
                {
                    e._preventDefault = false;
                }
                return controls[i].focus();
            }
        }
    };
    function displayFinalScreen()
    {
        $scope.userInfo = $sce.trustAsHtml((function() {
            let str = "<div><strong>Name: </strong>" + User.data.name + "</div>" + 
            "<div><strong>Email: </strong>" + User.data.email + "</div><div><strong>Booked rooms:</strong><div>" + 
            $scope.bookedDetails;
            return str;
        })());
        setState($scope.stateEnum.FINISH);
    }



    //// FINISH

    /**
     * Make function for adding user data to User
     */
});

