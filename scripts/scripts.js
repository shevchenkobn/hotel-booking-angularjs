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
    $scope.dateRange = getDateRange(data.dateLimits);
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
    const currentSelection = [];
    const highlightColor = '#ffffff';
    const defaultColor = '#E4E4DE';
    const defaultColorHover = '#EEEEE7';
    const colorMinLightness = 300;
    let userColor = (function() {
        let resume = false;
        let color = "#";
        do
        {
            let lightCounter = 0;
            for (var i = 0; i < 3; i++)
            {
                let currChannel = Math.floor(Math.random() * 255);
                lightCounter += currChannel;
                color += currChannel.toString(16);
            } 
            resume = lightCounter < colorMinLightness;
        }
        while (resume || color == highlightColor || color == defaultColor || color == defaultColorHover);
        return color;
    })();
    const ColoringEnum = {
        DEFAULT: 0,
        SELECTING: 1,
        SELECTED: 2
    };
    data.booked.contains = function(room, date) {
        return false;
    };
    let buttonPressed = false;
    let removing = false;
    let temp = [];
    temp.sourceIndex = 0;
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
                    let iterationStart, iterationEnd, startDate, increase = true;
                    console.log(temp, index);
                    if (index < temp.minIndex)
                    {
                        iterationStart = index;
                        iterationEnd = temp.minIndex - 1;
                        startDate = new Date(date);
                        temp.minIndex = index;
                    }
                    else if (index > temp.maxIndex)
                    {
                        iterationStart = temp.maxIndex + 1;
                        iterationEnd = index;
                        startDate = new Date(temp[temp.maxIndex].date);
                        startDate.setDate(startDate.getDate());
                        temp.maxIndex = index;
                    }
                    else if (index > temp.minIndex && index <= temp.originIndex)
                    {
                        iterationStart = temp.minIndex;
                        iterationEnd = index - 1;
                        temp.minIndex = index;
                        increase = false;
                    }
                    else if (index >= temp.originIndex && index < temp.maxIndex)
                    {
                        iterationStart = index + 1;
                        iterationEnd = temp.maxIndex;
                        temp.maxIndex = index;
                        increase = false;
                    }
                    if (!(iterationStart && iterationEnd))
                        return;
                    if (increase)
                    {
                        for (let i = iterationStart, currDate = startDate; i <= iterationEnd; i++)
                        {
                            if (cells[i].nodeName != "TD")
                                continue;
                            if (data.booked.contains(room, date) || temp[i])
                                break;
                            let d = new Date(currDate);
                            d.setDate(d.getDate() + 1);
                            temp[i] = bookedInfo.makeBookingItem(room, d);
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
                            if (!temp[i])
                                break;
                            delete temp[i];
                            mark(cells[i], removing ? ColoringEnum.SELECTED : ColoringEnum.DEFAULT);
                        }
                    }
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
                console.log(bookedInfo);
                temp.length = 0;
            }
        }[type](event);
        function mark(el, mode)
        {
            el = getTdParent(el);
            switch (mode) {
                case ColoringEnum.DEFAULT:
                    el.style.backgroundColor = defaultColor;
                    break;
                case ColoringEnum.SELECTING:
                    el.style.backgroundColor = highlightColor;
                    break;
                case ColoringEnum.SELECTED:
                    el.style.backgroundColor = userColor;
                    break;
            }
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
    function getDateRange(dateLimits)
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
    }
});

