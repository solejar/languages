var app = angular.module('lang');

app.controller('endingCtrl',function(){
    this.cases = ['именительный','внительный','родительный','дательный','предлогательный'];
    this.genders = ['M','F','N','Plural']
    this.adjType = ['hard (-ый,ой,ии)','soft (-ний)','short (-в)']
    this.partsOfSpeech = ['предлогательное','существительное']
    this.animate = ['animate','inanimate']

    this.getEndings = function(PoS,type,padex,animate,gender){
        console.log(PoS)
        console.log(this.endingsDict[PoS])
        console.log(type)
        if (padex=='внительный'){
            return this.endingsDict[PoS][type][padex][animate][gender]
        }else{

            return this.endingsDict[PoS][type][padex][gender]
        }
    }
    this.endingsDict = {
        'предлогательное': {
            'hard (-ый,ой,ии)': {
                'именительный': {
                    'M': '-ый','F': '-ая','N': '-ое','Plural': '-ые'
                },'внительный': {
                    'inanimate': {
                        'M': '-ый','F': '-ую','N': '-ое','Plural': '-ые'
                    },
                    'animate': {
                        'M': '-ого','F': '-ую','N': '-ое','Plural': '-ых' 
                    }
                },'родительный': {
                    'M': '-ого','F': '-ой', 'N': '-ого','Plural': '-ых'
                },'дательный': {
                    'M': '-ому','F': '-ой','N': '-ому','Plural': '-ым'
                },'творительный': {
                    'M': '-ым','F': '-ой','N': '-ым','Plural': '-ыми'
                },'предлогжный': {
                    'M': '-ом','F': '-ой','N': '-ом','Plural': '-ых'
                }
            },
            'soft (-ний)': {
                'именительный': {
                    'M': '-ий','F': '-яя','N': '-ее','Plural': '-ие'
                },'внительный': {
                    'inanimate': {
                        'M': '-ий','F': '-юю','N': '-ее','Plural': '-ие'
                    },
                    'animate': {
                        'M': '-его','F': '-юю','N': '-ее','Plural': '-их' 
                    }
                },'родительный': {
                    'M': '-его','F': '-ей','N': '-его','Plural': '-их'
                },'дательный': {
                    'M': '-ему','F': '-ей','N': '-ему','Plural': '-им'
                },'творительный': {
                    'M': '-им','F': '-ей/ею','N': '-им','Plural': '-ими'
                },'предложный': {
                    'M': '-ем','F': '-ей','N': '-ем','Plural': '-их'
                }
            },
            'short (-в)': {
                'M': '-','F': '-a','N': '-o', 'Plural': '-ы/и'
            }
        },
        'существительное': {
            'именительный': {
                    'M': '-ий','F': '-яя','N': '-ее','Plural': '-ие'
                },'внительный': {
                    'inanimate': {
                        'M': '-ий','F': '-юю','N': '-ее','Plural': '-ие'
                    },
                    'animate': {
                        'M': '-его','F': '-юю','N': '-ее','Plural': '-их' 
                    }
                },'родительный': {
                    'M': '-его','F': '-ей','N': '-его','Plural': '-их'
                },'дательный': {
                    'M': '-им', 'F': '-ей/ею','N': '-им','Plural': '-ими'
                },'предлогательный': {
                    'M': '-ем','F': '-ей','N': '-ем','Plural': '-их'
                }
        }
    }

    this.getEndingClass = function(padex,gender){
        return 0;
    }

    this.getNounEndingAnimate = function(padex,gender){
        return 0;
    }

        
    
});