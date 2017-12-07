var app = angular.module('lang');

app.controller('endingCtrl',function(){
    this.cases = ['именительный','внительный','родительный','дательный','предлогательный'];
    this.genders = ['M','F','N','Plural']
    this.adjType = ['hard (-ый,ой,ии)','soft (-ний)','short (-в)']
    this.partsOfSpeech = ['предлогательное','существительное']
    this.animate = ['yes','no']

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
                },'предлогательный': {
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
                    'M': '-им','F': '-ей/ею','N': '-им','Plural': '-ими'
                },'предлогательный': {
                    'M': '-ем','F': '-ей','N': '-ем','Plural': '-их'
                }
            },
            'short (-в)': {
                'M': '-','F': '-a','N': '-o', 'Plural': '-ы/и'
            }
        },
        'существительное': {

        }
    }
    
});