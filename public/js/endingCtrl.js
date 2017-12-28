var app = angular.module('lang');

app.controller('endingCtrl',function(sharedProps, $q){

    //to do list:    
    
    //remaining exceptions : 1
        //add family nouns (eventually, idgaf tbh)
            //ребёнок
            //брать
            //сестра
            //etc
        //add fleeting vowel nouns 
            //девушка
            //звонок
            //etc.
    //о -> об, в -> во
    //finish abstracting data away into mongo collection : 3
        //put endings in, make endpoint
        //put exceptions in, make endpoint
    //add gender suggestion: 4
        //class change
        //select val?
        //display warning if mismatch
        //separate out gender, plurality both on front and on noun/adj declension
    //move on to document reading : 5 (I think)
    //figure out some methodical way to do unit testing
        //run through all options with assertions?
        //karma + jasmine?
    //set up post request with noted inaccuracies : ? this is like a prelease thing
    
        
    this.genders = ['M','F','N']    
    this.animate = ['Animate','Inanimate']
    this.pluralities = ['Single','Plural']
    this.consonants = ['б','в','г','д','ж','з','к','л','м','н','п','р','с','т','ф','х','ц','ч','ш','щ']
    this.vowels = ['а','э','ы','у','о','я','е','ё','ю','и']
    this.exceptions = {}/*{
        'мой': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'моя' : {
            'gender': 'F',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'мое': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'твой': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'твоя': {
            'gender': 'F',
            'именительный': {
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'твое': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'свой': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'своя': {
            'gender': 'F',
            'именительный': {
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'ю', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'свое': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'howMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ём', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'наш': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'add', 'ending': 'и'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'add', 'ending': 'и'}    
                },
                'Animate': {
                    'Single': {'oper': 'add', 'ending': 'его'},
                    'Plural': {'oper': 'add', 'ending': 'их'}      
                }
            },'родительный': {
                'Single': {'oper': 'add', 'ending': 'его'},
                'Plural': {'oper': 'add', 'ending': 'их'}    
            },'дательный': {
                'Single': {'oper': 'add', 'ending': 'ему'},
                'Plural': {'oper': 'add', 'ending': 'им'}   
            },'творительный': {
                'Single': {'oper': 'add', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'add', 'ending': 'ими'} 
            },'предложный': {
                'Single': {'oper': 'add', 'ending': 'ем', 'dropHowMany': '1'},
                'Plural': {'oper': 'add', 'ending': 'их'}   
            }
        },
        'наша': {
            'gender': 'F',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'наше': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и','dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ем', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'ваш': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'add', 'ending': 'и'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'add', 'ending': 'и'}    
                },
                'Animate': {
                    'Single': {'oper': 'add', 'ending': 'его'},
                    'Plural': {'oper': 'add', 'ending': 'их'}      
                }
            },'родительный': {
                'Single': {'oper': 'add', 'ending': 'его'},
                'Plural': {'oper': 'add', 'ending': 'их'}    
            },'дательный': {
                'Single': {'oper': 'add', 'ending': 'ему'},
                'Plural': {'oper': 'add', 'ending': 'им'}   
            },'творительный': {
                'Single': {'oper': 'add', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'add', 'ending': 'ими'} 
            },'предложный': {
                'Single': {'oper': 'add', 'ending': 'ем', 'dropHowMany': '1'},
                'Plural': {'oper': 'add', 'ending': 'их'}   
            }
        },
        'ваша': {
            'gender': 'F',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'ваше': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и','dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'его', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'ему', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'ем', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'этот': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '2'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '2'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'го', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'oго', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'му', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им','dropHowMany': '2'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '2'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '2'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'м', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}   
            }
        },
        'эта': {
            'gender': 'F',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'это': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'add', 'ending': 'го'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'add', 'ending': 'го'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}
            },'дательный': {
                'Single': {'oper': 'add', 'ending': 'му'},
                'Plural': {'oper': 'replace', 'ending': 'им','dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'м', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'тот': {
            'gender': 'M',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '2'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '2'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'го', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'oго', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'му', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им','dropHowMany': '2'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '2'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '2'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'м', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '2'}   
            }
        },
        'та': {
            'gender': 'F',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'replace', 'ending': 'у', 'dropHowMany': '1'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}    
            },'дательный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'}   
            },'творительный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'F': {'oper': 'replace', 'ending': 'ой', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'то': {
            'gender': 'N',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'}    
                },
                'Animate': {
                    'Single': {'oper': 'add', 'ending': 'го'},
                    'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}      
                }
            },'родительный': {
                'Single': {'oper': 'add', 'ending': 'го'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}
            },'дательный': {
                'Single': {'oper': 'add', 'ending': 'му'},
                'Plural': {'oper': 'replace', 'ending': 'им','dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'им', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'м', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        },
        'столько': {
            'gender': 'all',
            'именительный': {                
                'Single': {'oper': 'none'},
                'Plural': {'oper': 'none'} 
            },'винительный': {
                'Inanimate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'none'}    
                },
                'Animate': {
                    'Single': {'oper': 'none'},
                    'Plural': {'oper': 'none'}      
                }
            },'родительный': {
                'Single': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}
            },'дательный': {
                'Single': {'oper': 'replace', 'ending': 'им','dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'им','dropHowMany': '1'}   
            },'творительный': {
                'Single': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'},
                'Plural': {'oper': 'replace', 'ending': 'ими', 'dropHowMany': '1'} 
            },'предложный': {
                'Single': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'} ,
                'Plural': {'oper': 'replace', 'ending': 'их', 'dropHowMany': '1'}   
            }
        }
    }*/

    this.sameGender = function(gender1,gender2){
        if(gender1=='all'||gender2=='all'){
            return true
        }else if(gender1==gender2){
            return true
        }else{
            return false
        }
    }

    this.getPrepositions = function(){

        var options = {
            url: '/getPrepositionList',
            params: {},
            method: 'GET',
        }

        var promises = [];

        console.log('about to fetch prepositions')

        promises.push(sharedProps.httpReq(options))

        $q.all(promises).then(function(res){
            this.prepositions = res[0].content.prepositions;
        }.bind(this));
        
    }
    this.prepositions = []

    this.checkCaseCount = function(caseArr){
        if(caseArr.length == 1){
            this.onlyOneCase = true;
            this.currCase = caseArr[0];
        }else{
            this.onlyOneCase = false;
        }
        
    }

    this.declineAdj = function(){
        if (this.currAdj&&this.currCase&&this.currPlurality&&this.currGender){
            
            var plur = this.currPlurality;
            var gen = this.currGender;//show selected or expected?
            var padex = this.currCase;
            var oldAdj = this.currAdj;
            var length = oldAdj.length;

            if(this.exceptions.hasOwnProperty(oldAdj)){
                var endingDict = this.exceptions[oldAdj]
            }else{
                var adjType = this.getAdjType(oldAdj);
                var endingDict = this.endingsDict['предлогательное'][adjType][gen]
            }

            if(padex =='винительный'){
                if(this.currAnimate){
                    var anim = this.currAnimate;
                    var declensionObj = endingDict[padex][anim][plur]
                }else{
                    return ''
                }
            }else{
                var declensionObj = endingDict[padex][plur]
            }
            

            var stem = oldAdj.substring(0,length-2);
            var newAdj = this.applyEnding(oldAdj,declensionObj)

            return newAdj;
        }else{
            return '';
        }
    }

    this.expectedGender = function(adj){
        if(this.exceptions.hasOwnProperty(adj)){
            return this.exceptions[adj]['gender']
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

    this.declineNoun = function(){
        if (this.currNoun&&this.currCase&&this.currPlurality&&this.currGender){
            var oldNoun = this.currNoun;
            var plur = this.currPlurality;
            var gen = this.currGender;
            var padex = this.currCase;
            var length = oldNoun.length;

            if(this.exceptions.hasOwnProperty(this.currNoun)){
                var endingDict = this.exceptions[this.currNoun]
            }else{
                var endingDict = this.endingsDict['существительное']
            }

            if(padex =='винительный'){
                if(this.currAnimate){
                    var anim = this.currAnimate;
                    var possibleEndings = endingDict[padex][anim][plur][gen]
                }else{
                    return ''
                }
            }else{
                var possibleEndings = endingDict[padex][plur][gen]
            }

            var lastLetter = oldNoun.substring(length-1,length);

            var log = []
            var consonants = this.consonants;
            angular.forEach(possibleEndings,function(value,key){
                if(key=='all'){
                    var declensionObj = possibleEndings[key];
                    this.push(declensionObj);

                }else if(key=='consonant'){
                    if(consonants.includes(lastLetter)){
                        var declensionObj = possibleEndings['consonant'];
                        this.push(declensionObj);
                    }
                }else{
                    if(key==lastLetter){
                        var declensionObj = possibleEndings[key];
                        this.push(declensionObj);
                    }
                }
            },log);

            if(!log[0]){
                if(possibleEndings.hasOwnProperty('else')){
                    var declensionObj = possibleEndings['else'];
                }else{
                    return oldNoun;
                }
                
            }else{
                var declensionObj = log[0]
            }

            //console.log(declensionObj);

            var newNoun = this.applyEnding(oldNoun,declensionObj);
            //console.log(newNoun)
            
            return newNoun;
        }else{
            return '';
        }
    }

    this.applyEnding = function(noun, declension){
        //console.log(declension)
        var oper = declension['oper'];
        if(oper=='none'){

            return noun;
        }else if(oper=='replace'){

            var howMany = declension['dropHowMany']
            var stem = noun.substring(0,noun.length-howMany)
            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(stem,ending);

            return stem+ruleAdjustedEnding
        }else if(oper=='drop'){

            return noun.substring(0,noun.length-1)
        }else if(oper=='add'){

            var ending = declension['ending']
            var ruleAdjustedEnding = this.checkSpellingRules(noun,ending)

            return noun+ruleAdjustedEnding;
        }else if(oper=='conditional'){

            var cond = declension['condition']
            var lastLetter = noun.substring(noun.length-1,noun.length)

            if(cond=='consonant'){
                if(this.consonants.includes(lastLetter)){
                    var declensionObj = declension['true']
                }else{
                    var declensionObj = declension['false']
                }                
            }else if(cond==lastLetter){
                var declensionObj = declension['true']
            }else{
                var declensionObj = declension['false']
            }

            return this.applyEnding(noun,declensionObj)
        }
    }

    this.softConsList = ['г','к','х','ж','ч','ш','щ','ц'];

    this.checkSpellingRules = function(origStem, origEnding){
        console.log(origStem + ' ' + origEnding)

        var stemLen = origStem.length;
        var lastStemLetter = origStem.substring(stemLen-1,stemLen)

        var firstEndingLetter = origEnding.substring(0,1)
        var newEnding = firstEndingLetter

        var endingLen = origEnding.length
        var endingRemainder = origEnding.substring(1,endingLen) //either blank or the last letter

        console.log(lastStemLetter + ' ' + firstEndingLetter + ' ' + endingRemainder)

        if(this.softConsList.includes(lastStemLetter)){
            if(firstEndingLetter=='ы'){
                newEnding = 'и'
            }else if(firstEndingLetter=='я'){
                newEnding = 'а'
            }else if(firstEndingLetter=='ю'){
                newEnding = 'у'
            }else if(!(lastStemLetter=='г'||lastStemLetter=='к'||lastStemLetter=='х')&&firstEndingLetter =='о'){
                newEnding = 'е'
            }
            
        }
        
        return newEnding+endingRemainder
    }

    this.endingsDict = {}/*{
        'предлогательное': {
            'hard': {
                'M': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ый'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ый'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ого'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ого'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ому'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ым'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ым'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ыми'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ом'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    }
                },
                'F': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ая'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ую'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ую'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ой'}, 
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ой'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ым'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ой'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ыми'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ой'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    }
                },
                'N': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ое'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ое'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ые'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ое'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ого'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ому'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ым'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ым'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ыми'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ом'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ых'}
                    }
                }
            },
            'soft': {
                'M': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ий'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ий'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'его'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'его'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ему'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'им'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'им'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ими'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ем'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    }
                },
                'F': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'яя'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'юю'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'юю'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ей'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ей'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'им'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ей/ею'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ими'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ей'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    }
                },
                'N': {
                    'именительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ее'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                    },'винительный': {
                        'Inanimate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ее'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ие'}
                        },
                        'Animate': {
                            'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ее'},
                            'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'} 
                        }
                    },'родительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'его'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    },'дательный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ему'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'им'}
                    },'творительный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'им'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ими'}
                    },'предложный': {
                        'Single': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'ем'},
                        'Plural': {'oper': 'replace', 'dropHowMany': '2', 'ending': 'их'}
                    }
                }
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
                        'й': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'}
                    },
                    'F': {
                        'я': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                        'а': {'oper': 'replace','ending': 'ы', 'dropHowMany': '1'}
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'а', 'dropHowMany': '1'},
                        'е': {'oper': 'replace','ending': 'я', 'dropHowMany': '1'}
                    }
                }
            },'винительный': {
                'Inanimate': {
                    'Single': {
                        'M': {'all': {'oper': 'none'}},
                        'F': {
                            'а':{'oper': 'replace','ending': 'y', 'dropHowMany': '1'},
                            'я': {'oper': 'replace','ending': 'ю', 'dropHowMany': '1'}
                        },
                        'N': {'all': {'oper': 'none'}}
                    },
                    //this is same as nominative
                    'Plural': {
                        'M': {
                            'consonant': {'oper': 'add','ending': 'ы'},
                            'й': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                            'ь': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'}
                        },
                        'F': {
                            'я': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                            'ь': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},
                            'а': {'oper': 'replace','ending': 'ы', 'dropHowMany': '1'}
                        },
                        'N': {
                            'о': {'oper': 'replace','ending': 'а', 'dropHowMany': '1'},
                            'е': {'oper': 'replace','ending': 'я', 'dropHowMany': '1'}
                        }
                    }
                },
                'Animate': {
                    'Single': {
                        'M': {
                            'consonant': {'oper': 'add','ending': 'а'},
                            'й': {'oper': 'replace','ending': 'я', 'dropHowMany': '1'},
                            'ь': {'oper': 'replace','ending': 'я', 'dropHowMany': '1'}
                        },
                        'F': {
                            'а':{'oper': 'replace','ending': 'y', 'dropHowMany': '1'},
                            'я': {'oper': 'replace','ending': 'ю', 'dropHowMany': '1'}
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
                            'я': {
                                'oper': 'conditional', 
                                'condition': 'consonant', 
                                'true': {
                                    'oper': 'replace',
                                    'ending':'ь', 
                                    'dropHowMany': '1'
                                }, 
                                'false': {'oper': 'replace','ending':'й', 'dropHowMany': '1'}
                            },
                            'ь': {'oper': 'add', 'ending': 'ей'}
                        },
                        'N': {
                            'о': {'oper': 'drop'},
                            'е': {'oper': 'replace','ending': 'ей', 'dropHowMany': '1'},
                            'ие': {'oper': 'replace','ending': 'ий', 'dropHowMany': '2'}
                        }
                    } 
                }
            },'родительный': {
                'Single': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'а'},
                        'й': {'oper': 'replace', 'ending': 'я', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace', 'ending': 'я', 'dropHowMany': '1'}
                    },
                    'F': {
                        'а': {'oper': 'replace', 'ending': 'ы', 'dropHowMany': '1'},
                        'я': {'oper': 'replace', 'ending': 'и', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace', 'ending': 'й', 'dropHowMany': '1'}
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'а', 'dropHowMany': '1'},
                        'е': {'oper': 'replace','ending': 'я', 'dropHowMany': '1'}
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
                        'я': {
                            'oper': 'conditional', 
                            'condition': 'consonant', 
                            'true': {'oper': 'replace','ending':'ь', 'dropHowMany': '1'}, 
                            'false': {'oper': 'replace', 'ending': 'й', 'dropHowMany': '1'}
                        },
                        'ь': {'oper': 'replace', 'ending': 'ей', 'dropHowMany': '1'}
                    },
                    'N': {
                        'о': {'oper': 'drop'},
                        'е': {'oper': 'replace','ending': 'ей', 'dropHowMany': '1'},
                        'ие': {'oper': 'replace','ending': 'ий', 'dropHowMany': '2'}
                    }
                }
            },'дательный': {
                'Single': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'у'},
                        'й': {'oper': 'replace','ending': 'ю', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace','ending': 'ю', 'dropHowMany': '1'}
                    },
                    'F': {
                        'а': {'oper': 'replace','ending': 'е', 'dropHowMany': '1'},
                        'я': {
                            'oper': 'conditional', 
                            'condition': 'и', 
                            'true' : {'oper': 'replace', 'ending': 'ии', 'dropHowMany': '2'}, 
                            'false': {'oper': 'replace', 'ending': 'е', 'dropHowMany': '1'}
                        },
                        'ь': {'oper': 'replace','ending': 'и', 'dropHowMany': '1'},                        
                    },
                    'N': {
                        'о': {'oper': 'replace','ending': 'у', 'dropHowMany': '1'},
                        'е': {'oper': 'replace','ending': 'ю', 'dropHowMany': '1'}
                    }
                },
                'Plural': {
                    'M': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'о': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ям', 'dropHowMany': '1'}
                    },
                    'F': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'о': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ям', 'dropHowMany': '1'}
                    },
                    'N': {
                        'consonant': {'oper': 'add', 'ending': 'ам'},
                        'а': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'о': {'oper': 'replace', 'ending': 'ам', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ям', 'dropHowMany': '1'}
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
                        'а': {'oper': 'replace','ending': 'ой', 'dropHowMany': '1'},
                        'я': {'oper': 'replace','ending': 'ей', 'dropHowMany': '1'},
                        'ь': {'oper': 'replace', 'ending': 'ью', 'dropHowMany': '1'}
                    },
                    'N': {
                        'all': {'oper': 'add','ending': 'м'}
                    }
                },
                'Plural': {
                    'M': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ями', 'dropHowMany': '1'}
                    },
                    'F': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ями', 'dropHowMany': '1'}
                    },
                    'N': {
                        'consonant': {'oper': 'add','ending': 'ами'},
                        'а': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ами', 'dropHowMany': '1'},
                        'else': {'oper': 'replace', 'ending': 'ями', 'dropHowMany': '1'}
                    }
                }
            },'предложный': {
                'Single': {
                    'M': {'all': {'oper': 'add','ending': 'е'}},
                    'F': {
                        'а' : {'oper': 'replace','ending': 'e', 'dropHowMany': '1'},
                        'я' : {'oper': 'replace','ending': 'e', 'dropHowMany': '1'},
                        'ь' : {'oper': 'replace','ending': 'и', 'dropHowMany': '1'}
                    },
                    'N': {
                        'о': {'oper': 'replace', 'ending': 'е', 'dropHowMany': '1'},
                    }
                },
                'Plural': {
                    'M': {
                        'а': {'oper': 'replace','ending': 'ax', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ах', 'dropHowMany': '1'},
                        'consonant': {'oper': 'add','ending': 'ах', 'dropHowMany': '1'},
                        'else': {'oper': 'replace','ending': 'ях', 'dropHowMany': '1'}
                    },
                    'F': {
                        'а': {'oper': 'replace','ending': 'ax', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ах', 'dropHowMany': '1'},
                        'consonant': {'oper': 'add','ending': 'ах'},
                        'else': {'oper': 'replace','ending': 'ях', 'dropHowMany': '1'}
                    },
                    'N': {
                        'а': {'oper': 'replace','ending': 'ax', 'dropHowMany': '1'},
                        'о': {'oper': 'replace','ending': 'ах', 'dropHowMany': '1'},
                        'consonant': {'oper': 'add','ending': 'ах'},
                        'else': {'oper': 'replace','ending': 'ях', 'dropHowMany': '1'}
                    }
                }
            }
        }
    }*/        
   
    

});