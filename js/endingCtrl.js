var app = angular.module('lang');

app.controller('endingCtrl',function(){

    //to do list:
    //function to determine the declension for noun
    //function to check spelling rules before making a change
    //perhaps generalize dict, once we have spelling rules in place?
    //abstract data away into mongo collection
    //  set up pipework for mongo interaction
    //determine schema for 'exception' cases
    //set up post request with noted inaccuracies
    //move on to document reading (this is a big feature)
        
    this.genders = ['M','F','N']    
    this.animate = ['Animate','Inanimate']
    this.pluralities = ['Single','Plural']
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
    this.vowels = ['а','э','ы','у','о','я','е','ё','ю','и']

    this.prepositions = [
        {
            'name': 'none', 
            'cases':    
                ['именительный','винительный','родительный','дательный','предложный']
        },
        {
            'name': 'у', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'за', 
            'cases':    
                ['именительный','винительный','предложный']
        },
        {
            'name': 'около', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'на', 
            'cases':    
                ['винительный','предложный']
        },
        {
            'name': 'с', 
            'cases':    
                ['творительный','винительный','родительный']
        },
        {
            'name': 'над', 
            'cases':    
                ['творительный']
        },
        {
            'name': 'под', 
            'cases':    
                ['винительный','творительный']
        },
        {
            'name': 'из', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'в', 
            'cases':    
                ['винительный','предложный']
        },
        {
            'name': 'по', 
            'cases':    
                ['именительный','винительный','дательный','предложный']
        },
        {
            'name': 'через', 
            'cases':    
                ['винительный']
        },
        {
            'name': 'вокруг', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'к', 
            'cases':    
                ['дательный']
        },
        {
            'name': 'от', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'при', 
            'cases':    
                ['предложный']
        },
        {
            'name': 'без', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'до', 
            'cases':    
                ['родительный']
        },
        {
            'name': 'благодаря', 
            'cases':    
                ['дательный']
        },
        {
            'name': 'близ', 
            'cases':    
                ['родительный']
        }
    ]

    this.checkCaseCount = function(caseArr){
        if(caseArr.length == 1){
            this.onlyOneCase = true;
        }else{
            this.onlyOneCase = false;
        }

        this.currCase = caseArr[0];
    }

    this.conjugAdj = function(){
        if (this.currAdj&&this.currCase&&this.currPlurality&&this.currGender){
            
            var plur = this.currPlurality;
            var gen = plur=='Single'? this.currGender: plur;
            var padex = this.currCase;
            var newAdj = this.currAdj;
            var length = newAdj.length;

            var adjType = this.getAdjType(newAdj);

            var vals = [adjType,]
            console.log()

            if(padex =='винительный'){
                if(this.currAnimate){
                    var anim = this.currAnimate;
                    var newEnding = this.endingsDict['предлогательное'][adjType][padex][anim][gen]
                }
            }else{
                newEnding = this.endingsDict['предлогательное'][adjType][padex][gen]
            }
            
            if(adjType=='hard'){
                newAdj = newAdj.substring(0,length-2) + newEnding;
            }else if(adjType=='soft'){
                newAdj = newAdj.substring(0,length-3) + newEnding;
            }

            return newAdj;
        }else{
            return '';
        }
    }

    this.conjugNoun = function(){
        if (this.currNoun){
            var newNoun = this.currNoun;

            var declensi
            return newNoun;
        }else{
            return '';
        }
    }

    this.getAdjType = function(adj){
        var length = adj.length;
        var ending = adj.substring(length-3,length);

        if(ending=='ний'||ending =='няя'||ending=='нее'){
            return 'soft'
        }else{
            return 'hard'
        }
    }

    this.endingsDict = {
        'предлогательное': {
            'hard': {
                'именительный': {
                    'M': 'ый','F': 'ая','N': 'ое','Plural': 'ые'
                },'винительный': {
                    'Inanimate': {
                        'M': 'ый','F': 'ую','N': 'ое','Plural': 'ые'
                    },
                    'Animate': {
                        'M': 'ого','F': 'ую','N': 'ое','Plural': 'ых' 
                    }
                },'родительный': {
                    'M': 'ого','F': 'ой', 'N': 'ого','Plural': 'ых'
                },'дательный': {
                    'M': 'ому','F': 'ой','N': 'ому','Plural': 'ым'
                },'творительный': {
                    'M': 'ым','F': 'ой','N': 'ым','Plural': 'ыми'
                },'предлогжный': {
                    'M': 'ом','F': 'ой','N': 'ом','Plural': 'ых'
                }
            },
            'soft': {
                'именительный': {
                    'M': 'ий','F': 'яя','N': 'ее','Plural': 'ие'
                },'винительный': {
                    'Inanimate': {
                        'M': 'ий','F': 'юю','N': 'ее','Plural': 'ие'
                    },
                    'Animate': {
                        'M': 'его','F': 'юю','N': 'ее','Plural': 'их' 
                    }
                },'родительный': {
                    'M': 'его','F': 'ей','N': 'его','Plural': 'их'
                },'дательный': {
                    'M': 'ему','F': 'ей','N': 'ему','Plural': 'им'
                },'творительный': {
                    'M': 'им','F': 'ей/ею','N': 'им','Plural': 'ими'
                },'предложный': {
                    'M': 'ем','F': 'ей','N': 'ем','Plural': 'их'
                }
            },
            'short (-в)': {
                'M': '','F': 'а','N': ' o', 'Plural': 'ы/и'
            }
        },
        'существительное': {
            'именительный': {
                'Single': {
                    'M': {
                        'all': {'oper': 'none'}
                    },
                    'F': {
                        'all': {'oper': 'none'}
                    },
                    'N': {
                        'all': {'oper': 'none'}
                    }
                },
                'Plural': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'ы'},
                        'й': {'oper': 'replace','ending': 'и'},
                        'ь': {'oper': 'replace','ending': 'и'}
                    },
                    'F': {
                        'я': {'oper': 'replace','ending': 'и'},
                        'ь': {'oper': 'replace','ending': 'и'},
                        'а': {'oper': 'replace','ending': 'ы'}
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'а'},
                        'е': {'oper': 'replace','ending': 'я'}
                    }
                }
            },'винительный': {
                'Inanimate': {
                    'Single': {
                        'M': {'all': {'oper': 'none'}},
                        'F': {
                            'а':{'oper': 'replace','ending': 'y'},
                            'я': {'oper': 'replace','ending': 'ю'}
                        },
                        'N': {'all': {'oper': 'none'}}
                    },
                    //this is same as nominative
                    'Plural': {
                        'M': {
                            'consonant': {'oper': 'add','ending': 'ы'},
                            'й': {'oper': 'replace','ending': 'и'},
                            'ь': {'oper': 'replace','ending': 'и'}
                        },
                        'F': {
                            'я': {'oper': 'replace','ending': 'и'},
                            'ь': {'oper': 'replace','ending': 'и'},
                            'а': {'oper': 'replace','ending': 'ы'}
                        },
                        'N': {
                            'о': {'oper': 'replace','ending': 'а'},
                            'е': {'oper': 'replace','ending': 'я'}
                        }
                    }
                },
                'Animate': {
                    'Single': {
                        'M': {
                            'consonant': {'oper': 'add','ending': 'а'},
                            'й': {'oper': 'replace','ending': 'я'},
                            'ь': {'oper': 'replace','ending': 'я'}
                        },
                        'F': {
                            'а':{'oper': 'replace','ending': 'y'},
                            'я': {'oper': 'replace','ending': 'ю'}
                        },
                        'N': {'all': {'oper': 'none'}}
                    },
                    //this is same as genitive plural rules
                    'Plural': {
                        'M': {
                            'ж': {'oper': 'add','ending': 'ей'},
                            'ч': {'oper': 'add','ending': 'ей'},
                            'ш': {'oper': 'add','ending': 'ей'},
                            'щ': {'oper': 'add','ending': 'ей'},
                            'ь': {'oper': 'add','ending': 'ей'},
                            'й': {'oper': 'add','ending': 'ев'},
                            'ц': {'oper': 'add','ending': 'ев'},
                            'else': {'oper': 'add','ending': 'ов'} //how to we do this?
                        },
                        'F': {
                            'а': {'oper': 'drop'},
                            'я': {'oper': 'conditional', 'condition': 'consonant', 'true': {'oper': 'replace','ending':'ь'}, 'false': {'oper': 'replace','ending':'й'}},
                            'ь': {'oper': 'add', 'ending': 'ей'}
                        },
                        'N': {
                            'о': {'oper': 'drop'},
                            'е': {'oper': 'replace','ending': 'ей'},
                            'ие': {'oper': 'replace','ending': 'ий'}
                        }
                    } 
                }
            },'родительный': {
                'Single': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'а'},
                        'й': {'oper': 'replace', 'ending': 'я'},
                        'ь': {'oper': 'replace', 'ending': 'я'}
                    },
                    'F': {
                        'а': {'oper': 'replace', 'ending': 'ы'},
                        'я': {'oper': 'replace', 'ending': 'и'},
                        'ь': {'oper': 'replace', 'ending': 'й'}
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'а'},
                        'е': {'oper': 'replace','ending': 'я'}
                    }
                },
                'Plural': {
                    'M': {
                        'ж': {'oper': 'add','ending': 'ей'},
                        'ч': {'oper': 'add','ending': 'ей'},
                        'ш': {'oper': 'add','ending': 'ей'},
                        'щ': {'oper': 'add','ending': 'ей'},
                        'ь': {'oper': 'add','ending': 'ей'},
                        'й': {'oper': 'add','ending': 'ев'},
                        'ц': {'oper': 'add','ending': 'ев'},
                        'else': {'oper': 'add','ending': 'ов'} //how to we do this?
                    },
                    'F': {
                        'а': {'oper': 'drop'},
                        'я': {'oper': 'conditional', 'condition': 'consonant', 'true': {'oper': 'replace','ending':'ь'}, 'false': {'oper': 'replace', 'ending': 'й'}},
                        'ь': {'oper': 'replace', 'ending': 'ей'}
                    },
                    'N': {
                        'о': {'oper': 'drop'},
                        'е': {'oper': 'replace','ending': 'ей'},
                        'ие': {'oper': 'replace','ending': 'ий'}
                    }
                }
            },'дательный': {
                'Single': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'у'},
                        'й': {'oper': 'replace','ending': 'ю'},
                        'ь': {'oper': 'replace','ending': 'ю'}
                    },
                    'F': {
                        'а': {'oper': 'replace','ending': 'е'},
                        'я': {'oper': 'conditional', 'condition': 'и', 'true' : {'oper': 'replace', 'ending': 'ии'}, 'false': {'oper': 'replace', 'ending': '*е'}},
                        'ь': {'oper': 'replace','ending': 'и'},                        
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'у'},
                        'е': {'oper': 'replace','ending': 'ю'}
                    }
                },
                'Plural': {
                    'M': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'add', 'ending': 'ам'},
                        'о': {'oper': 'add', 'ending': 'ам'},
                        'else': {'oper': 'replace', 'ending': 'ям'}
                    },
                    'F': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'add', 'ending': 'ам'},
                        'о': {'oper': 'add', 'ending': 'ам'},
                        'else': {'oper': 'replace', 'ending': 'ям'}
                    },
                    'N': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'add', 'ending': 'ам'},
                        'о': {'oper': 'add', 'ending': 'ам'},
                        'else': {'oper': 'replace', 'ending': 'ям'}
                    }
                }
            },'творительный': {
                'Single': {
                    'M': {
                        'ж': {'oper': 'add', 'ending': 'ем'},
                        'ц': {'oper': 'add', 'ending': 'ем'},
                        'ч': {'oper': 'add', 'ending': 'ем'},
                        'ш': {'oper': 'add', 'ending': 'ем'},
                        'щ': {'oper': 'add', 'ending': 'ем'},
                        'й': {'oper': 'add', 'ending': 'ем'},
                        'ь': {'oper': 'add', 'ending': 'ем'},
                        'else': {'oper': 'add','ending': 'ом'}
                    },
                    'F': {
                        'а': {'oper': 'replace','ending': 'ой'},
                        'я': {'oper': 'replace','ending': 'ей'},
                        'ь': {'oper': 'replace', 'ending': 'ью'}
                    },
                    'N': {
                        'all': {'oper': 'add','ending': 'м'}
                    }
                },
                'Plural': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами'},
                        'о': {'oper': 'replace','ending': 'ами'},
                        'else': {'oper': 'replace', 'ending': 'ями'}
                    },
                    'F': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами'},
                        'о': {'oper': 'replace','ending': 'ами'},
                        'else': {'oper': 'replace', 'ending': 'ями'}
                    },
                    'N': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами'},
                        'о': {'oper': 'replace','ending': 'ами'},
                        'else': {'oper': 'replace', 'ending': 'ями'}
                    }
                }
            },'предложный': {
                'Single': {
                    'M': {'all': {'oper': 'add','ending': 'е'}},
                    'F': {
                        'а' : {'oper': 'replace','ending': 'e'},
                        'я' : {'oper': 'replace','ending': 'e'},
                        'ь' : {'oper': 'replace','ending': 'и'}
                    },
                    'N': {
                        'о': {'oper': 'replace', 'ending': 'е'},
                    }
                },
                'Plural': {
                    'M': {
                        'а': {'oper': 'replace','ending': 'ax'},
                        'о': {'oper': 'replace','ending': 'ах'},
                        'else': {'oper': 'replace','ending': 'ях'}
                    },
                    'F': {
                        'а': {'oper': 'replace','ending': 'ax'},
                        'о': {'oper': 'replace','ending': 'ах'},
                        'else': {'oper': 'replace','ending': 'ях'}
                    },
                    'N': {
                        'а': {'oper': 'replace','ending': 'ax'},
                        'о': {'oper': 'replace','ending': 'ах'},
                        'else': {'oper': 'replace','ending': 'ях'}
                    }
                }
            }
        }
    }        
   
    this.declineNoun = function(declension){

    }

    this.checkSpellingRules = function(origWord, origEnding){
   
    }

});