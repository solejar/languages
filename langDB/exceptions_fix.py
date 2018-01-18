#!/usr/bin/python
#encoding: utf-8
import tinysegmenter
import operator
import json
import io

filename = './russianCollection.json'

#data = json.load(open(filename))
inputfile = io.open(filename,mode='r',encoding='utf-8')

line_list = inputfile.readlines()

outputfile = io.open('reformattedCollection.json',mode='w',encoding ='utf-8')


newJSON = {}
grammar_stack = []
exception_vals = {}

for line in line_list[2:]:
    line = line.strip()
    if line.find("ruleGroups") != -1:
        break
    elif line.find("{") != -1:
        #print line
        print 'new Object located'
        grammar_stack.append("{")
    elif line.find("},") !=-1:
        print 'object completed'
        try:
            grammar_stack.pop()
        except IndexError as e:
            print 'writing done'
            break
        print exception_vals
        outputfile.write('\"'+exception_vals['word']+ '\": {\n' )
        new_str = ''
        for attr, val in exception_vals.iteritems():
            new_str += '\"' + attr + '\": \"' + val + '\",'
        new_str = new_str[:-1] + '\n},'
        outputfile.write(new_str)

        print 'just added a word name ' + exception_vals['word']
        
        exception_vals = {}
    elif line.find("}") !=-1:
        print 'object completed'
        try:
            grammar_stack.pop()
        except IndexError as e:
            print 'writing done'
            break
        print exception_vals
        outputfile.write(exception_vals['word']+ '\": {\n' )
        for attr, val in exception_vals.iteritems():
            new_str += '\"' + attr + '\": \"' + val + '\",'
        new_str = new_str[:-1] + '\n}'
        outputfile.write(new_str)

        print 'just added a word name ' + exception_vals['word']
    else:

        key_val_arr = line.split(": ")
        name = key_val_arr[0].split("\"")[1]

        val = key_val_arr[1].split(',')[0].split("\"")[1]

        print 'adding a val to my JSON of ' + name + ' ,' + val
        exception_vals[name] = val
