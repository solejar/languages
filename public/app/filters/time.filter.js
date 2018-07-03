angular.module('lang').filter('timeFilter',function(){

    const timeConstants = {
        'min': 1,
        'hour': 60,
        'day': 1440,
        'month': 1440*30,
        'year': 1440*365
    };

    return function(phrase){

        let keys = Object.keys(timeConstants);
        //console.log('num of keys is: ' + keys.length);
        let numKeys = keys.length;
        let time = parseInt(phrase,10);

        //run through all possibilities to see what time range our number falls into
        for(let i = 0; i<numKeys-1; i++){
            let currKey = keys[i];
            let nextKey = keys[i+1];

            let currCeiling = timeConstants[nextKey];
            let currFloor = timeConstants[currKey];

            //if the time is less than the next interval (i.e. 35min<1hr=60min, therefore falls in minute range)
            if(time<currCeiling){
                //just rounding up to avoid showing the user decimal amounts of time
                time = Math.ceil(time/currFloor);
                let filteredPhrase = '\u2264' + time.toString()+currKey;

                return filteredPhrase;
            }
            //console.log('time: '+time+ ' was greater than: '+currCeiling);
        }

        //should only reach this section of code if the unit of time is greater than a year.
        time = Math.ceil(time/timeConstants.year);
        return '\u2264' + time.toString()+'year';

    };
});
