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
    $scope.dateRange = (function(dateLimits)
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
    bookedInfo.makeBookingItem = function makeBookingItem(room, date)
    {
        room.date = date;
        return room;
    };
    bookedInfo.tryAdd = function(room, date)
    {
        let item = this.makeBookingItem(room, date);
        if (this.indexOf(item))
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
        this[index] = this.pop();
        return true;
    }
    bookedInfo.clear = function() {
        this.length = 0;
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
                let currChannel = Math.random() * 255;
                lightCounter += currChannel;
                color += currChannel.toString(16);
            } 
            resume = lightCounter < colorMinLightness;
        }
        while (resume || color == highlightColor || color == defaultColor || color == defaultColorHover);
        return color;
    })();
    data.booked.contains = function(room, date) {
        return false;
    };
    let buttonPressed = false;
    let removing = false;
    let temp = [];
    temp.sourceIndex = 0;
    temp.minIndex = 0;
    temp.maxIndex = 0;
    $scope.mouseEventHandler = function(room, date, type, $event)
    {
        return {
            'down': function(e) {
                let td = getTdParent(e.source);
                let selected = isSelected(td);
                let item = makeBookingItem(room, date);
                if (data.booked.contains(item))
                    return;
                removing = !bookedInfo.tryAdd(item)
                temp.sourceIndex = temp.maxIndex = temp.minIndex = td.parentNode.childNodes.slice().indexOf(td);
                temp[temp.sourceIndex] = item;
                buttonPressed = true;
                mark(td, !removing);
            },
            'move': function(e) {
                if (buttonPressed)
                {
                    let index = td.parentNode.childNodes.slice().indexOf(td);
                    // define direction and mark
                    
                }
            },
            'up': function(e) {
                buttonPressed = false;
                // add or remove selected cells
            }
        }[type]($event);
        function mark(el, empty)
        {
            let el = getTdParent(el);
            el.style.backgroundColor = empty ? highlightColor : defaultColor;
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
        function isSelected(el)
        {
            let el = getTdParent(el);
            return el.style.backgroundColor != defaultColor;
        }
    }



    $scope.bookedMsg = noBooked;
});

