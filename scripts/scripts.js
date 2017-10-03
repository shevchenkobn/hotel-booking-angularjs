let suitesInfo = {
    "rooms": [
        {
            type: 1,
            storey: 3,
            number: "325",
            price: 400,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "324",
            price: 400,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "323",
            price: 400,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "322",
            price: 380,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "321",
            price: 390,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "320",
            price: 350,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 3,
            number: "319",
            price: 440,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 2,
            number: "225",
            price: 320,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 2,
            number: "224",
            price: 340,
            desciption: "A cosy room"
        },
        {
            type: 1,
            storey: 2,
            number: "228",
            price: 340,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 3,
            number: "300",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 3,
            number: "301",
            price: 260,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 3,
            number: "302",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 3,
            number: "303",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 0,
            number: "18",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 0,
            number: "17",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 0,
            storey: 0,
            number: "16",
            price: 250,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 3,
            number: "340",
            price: 650,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 3,
            number: "341",
            price: 650,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 3,
            number: "342",
            price: 650,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 1,
            number: "180",
            price: 630,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 1,
            number: "181",
            price: 630,
            desciption: "A cosy room"
        },
        {
            type: 2,
            storey: 1,
            number: "182",
            price: 630,
            desciption: "A cosy room"
        },
        {
            type: 3,
            storey: 4,
            number: "4A",
            price: 800,
            desciption: "A cosy room"
        },
        {
            type: 3,
            storey: 4,
            number: "4B",
            price: 900,
            desciption: "A cosy room"
        },
        {
            type: 3,
            storey: 4,
            number: "4C",
            price: 1100,
            desciption: "A cosy room"
        },
    ],
    "roomsTypes": [
        "Single", "Double", "Triple/Family", "Suite"
    ],
    "dateLimits": [
      "","9 Oct 2017"  
    ],
    "booked": [

    ]
};

let app = angular.module('table-reg', []);
app.controller('table-ctrl', function($scope, $http) {
    // make an ajax request using $http
    const data = suitesInfo;

    const noBooked = "You haven't book anything yet.";
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
    const bookedInfo = [];
    bookedInfo.makeBookingItem = function(room, date)
    {
        var item = {};
        Object.assign(item, room);
        item.date = date;
        return item;
    };
    bookedInfo.tryAdd = function(room, date)
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
    bookedInfo.tryRemove = function(room, date)
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
    bookedInfo.compare = function(item1, item2) {
        return item1.type == item2.type && item1.storey == item2.storey && item1.number == item2.number && item1.price == item2.price
            && item1.desciption == item2.desciption && item1.date.valueOf() == item2.date.valueOf();
    };
    bookedInfo.indexOf = function(item)
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

    data.booked.contains = function(room, date) {
        return false;
    };
    data.booked.compare = bookedInfo.compare;
    data.booked.makeBookingItem = bookedInfo.makeBookingItem;
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
        return {
            'down': function(e) {
                if (buttonPressed)
                    return;
                let td = getTdParent(e.srcElement);
                let item = bookedInfo.makeBookingItem(room, date);
                if (data.booked.contains(room, date))
                    return;
                cells = td.parentNode.childNodes;
                temp.originIndex = temp.maxIndex = temp.minIndex = Array.prototype.slice.call(cells).indexOf(td);
                temp[temp.originIndex] = item;
                buttonPressed = true;
                removing = bookedInfo.indexOf(item) >= 0;
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
                    console.log(temp.minIndex, temp.originIndex, temp.maxIndex, index);
                    if (increase)
                    {
                        for (let i = iterationStart, currDate = startDate; i <= iterationEnd; i++)
                        {
                            if (cells[i].nodeName != "TD")
                                continue;
                            let d = new Date(currDate);
                            d.setDate(d.getDate() + 1);
                            let item = bookedInfo.makeBookingItem(room, d);
                            // if (removing)
                            //     debugger;
                            if (data.booked.contains(room, date) || removing && bookedInfo.indexOf(item) < 0 ||
                                !removing && bookedInfo.indexOf(item) >= 0)
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
                            // if (data.booked.contains(room, date) || bookedInfo.indexOf(temp[i]) < 0)
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
                        bookedInfo.tryAdd(temp[i]);
                        mark(cells[i], ColoringEnum.SELECTED);
                    }
                }
                else
                {
                    for (let i = temp.minIndex; i <= temp.maxIndex; i++)
                    {
                        if (!temp[i])
                            continue;
                        bookedInfo.tryRemove(temp[i]);
                        mark(cells[i], ColoringEnum.DEFAULT);
                    }
                }
                let dates = "";
                for (let i = 0; i < bookedInfo.length; i++)
                    dates += bookedInfo[i].date + "::";
                console.log(dates);
                // console.log(bookedInfo);
                temp.length = 0;
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
});

