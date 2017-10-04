let app = angular.module('hotel-booking', ['720kb.tooltips']);
app.factory('Data', function($http) {
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
.controller('mainController', function($scope, $window, Data, User) {
    $scope.stateEnum = {
        FORM: 1,
        ROOM: 2,
        FINISH: 3
    };
    hints = ["Enter your personal data", "Select rooms you want to book. Click on preferable date.", "Congratulations!"];
    let viewState;
    function setState(value) {
        viewState = value;
        $scope.hint = hints[value - 1];
        $window.scrollTo(0, 0);
    }
    setState($scope.stateEnum.FORM);
    $scope.hint;
    Object.defineProperty($scope, 'getState', {
		writable: false,
		value: function() {
			return viewState;
		}
    });
    //// FORM 
    $scope.name = "";
    $scope.email = "";
    $scope.is18 = false;
    $scope.namePattern = /[A-Z]([a-zA-Z\-'])+/;
    $scope.formSubmit = function () {
        User.name = $scope.name;
        User.email = $scope.email;
        setState($scope.stateEnum.ROOM);
    };


    //// BOOK
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

        for (var i = firstDate; i <= lastDate; i.setDate(i.getDate() + 1))
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
    }
    data.rooms.compare = function(item1, item2) {
        return item1.type == item2.type && item1.storey == item2.storey && item1.number == item2.number && item1.price == item2.price
            && item1.description == item2.description;
    }
    bookedRooms.compare = function(item1, item2) {
        return data.rooms.compare(item1, item2) && item1.date.valueOf() == item2.date.valueOf();
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
    
    $scope.defaultColor = '#E4E4DE';
    $scope.selectingColor = '#ffffff';
    const ColoringEnum = {
        DEFAULT: $scope.defaultColor,
        SELECTING: $scope.selectingColor,
        SELECTED: (function(colorMinLightness) {
            let resume = false;
            let color = "#";
            do
            {
                color = '#';
                let lightCounter = 0;
                for (var i = 0; i < 3; i++)
                {
                    let currChannel = Math.floor(Math.random() * 255);
                    lightCounter += currChannel;
                    let str = currChannel.toString(16); 
                    color += str.length < 2 ? '0' + str : str;
                } 
                resume = lightCounter < colorMinLightness;
            }
            while (resume || color == $scope.selectingColor || color == $scope.defaultColor);
            return color;
        })(300)
    };
    $scope.getUserColor = () => ColoringEnum.SELECTED;
    data.booked.contains = function(room, date) {
        return false;
    };
    data.booked.compare = bookedRooms.compare;
    data.booked.makeBookingItem = bookedRooms.makeBookingItem;
    data.booked.containsColor = function(color) {
        return false;
    }

    let buttonPressed = false;
    let removing = false;
    let exceeded = false;
    let temp = [];
    temp.originIndex = 0;
    temp.minIndex = 0;
    temp.maxIndex = 0;
    let cells;
    $scope.mouseEventHandler = function(room, date, type, event)
    {
        if (event.originalEvent)
            event = event.originalEvent;
        return {
            'down': function(e) {
                if (buttonPressed)
                    return;
                let td = getTdParent(e.srcElement);
                let item = bookedRooms.makeBookingItem(room, date);
                if (data.booked.contains(room, date))
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
                    let iterationStart, iterationEnd, startDate, increase = true, changeTempProps = function() {};
                    if (index < temp.minIndex)
                    {
                        if (exceeded)
                            return;
                        iterationStart = index;
                        iterationEnd = temp.minIndex - 1;
                        startDate = new Date(date);
                        startDate.setDate(startDate.getDate() - 1);
                        changeTempProps = function() { temp.minIndex = index; };
                    }
                    else if (index > temp.maxIndex)
                    {
                        iterationStart = temp.maxIndex + 1;
                        iterationEnd = index;
                        startDate = new Date(temp[temp.maxIndex].date);
                        changeTempProps = function() { temp.maxIndex = index; };
                    }
                    else if (index > temp.minIndex && index <= temp.originIndex)
                    {
                        exceeded = false;
                        iterationStart = temp.minIndex;
                        iterationEnd = index - 1;
                        increase = false;
                        changeTempProps = function() { temp.minIndex = index; };
                    }
                    else if (index >= temp.originIndex && index < temp.maxIndex)
                    {
                        iterationStart = index + 1;
                        iterationEnd = temp.maxIndex;
                        increase = false;
                        changeTempProps = function() { temp.maxIndex = index; }
                    }
                    if (!(iterationStart && iterationEnd))
                        return;
                    if (increase)
                    {
                        for (let i = iterationStart, currDate = startDate; i <= iterationEnd; i++)
                        {
                            if (cells[i].nodeName != "TD")
                                continue;
                            let d = new Date(currDate);
                            d.setDate(d.getDate() + 1);
                            let item = bookedRooms.makeBookingItem(room, d);
                            // if (removing)
                            //     debugger;
                            if (data.booked.contains(room, date) || removing && bookedRooms.indexOf(item) < 0 ||
                                !removing && bookedRooms.indexOf(item) >= 0)
                            {
                                exceeded = true;
                                changeTempProps = function() {};
                                break;
                            }
                            temp[i] = item;
                            mark(cells[i], ColoringEnum.SELECTING);
                            currDate.setDate(currDate.getDate() + 1);
                        }
                    }
                    else
                    {
                        for (let i = iterationStart; i <= iterationEnd; i++)
                        {
                            if (cells[i].nodeName != "TD")
                                continue;
                            // if (data.booked.contains(room, date) || bookedRooms.indexOf(temp[i]) < 0)
                            // {
                            //     debugger;
                            //     changeTempProps = function() {};
                            //     break;
                            // }
                            delete temp[i];
                            mark(cells[i], removing ? ColoringEnum.SELECTED : ColoringEnum.DEFAULT);
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
        function mark(el, color)
        {
            el = getTdParent(el);
            el.style.backgroundColor = color;
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
    }
    $scope.bookedMsg = noBooked;
    $scope.bookedDetails = noBooked;
    function updateBookedDisplay()
    {
        console.log(bookedRooms);
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
    }
    $scope.bookingFinish = function()
    {
        User.booked = bookedRooms;
        setState($scope.stateEnum.FINISH);
    }

    //// FINISH

    $scope.seeUser = function() {
        return User;
    }

    /**
     * Make function for adding user data to User
     */
});

