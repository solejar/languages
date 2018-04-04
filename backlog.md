# Backlog

## Decliner

### Functional

- some weird adjectives don't work, like numerals
- учитель Not the same as as писатель 
- double-check the `ng-blur()` is working as expected with `currGender`
- **if decliner uses default ruleGroup, something is up. Let's indicate it.**
- Consider generalizing a 'stem change' case, let's use remove like 10-15 rule groups, but adds more controller logic (might not be worth it)
- Should generating a card clear inputs? Decide yes or no.
- Should a warning be generate before removing a card ( in general and also for this)

### Non-functional

- how should components reorder here to effectively use space real estate? 
- **Make it look good for flex-xs**
- (try to) remove borders around whiteframe for only mobile view (`flex-xs`).    
- Make `ng-autocomplete` not look like poopoo


## Login

### Functional

- add widget for sign-in (not priority)
- level of language (not sure how to implement, add later)
- show some example words, see if they know them. (after we set up reading section)
- Allow signin with email or username if applicable ( Not a priority)

**Non-functional**

- **improve spacing**
- **check out `flex` for different device sizes**



## Card

**Functional**

* Generate some sort of HTML template for this
* Add edit functionality (?)
  * Editing assumes end-user responsibility for card content
  * If this is the case, there won't be reporting
* Add mark functionality
  * Mark as difficult? Important? Should this be a one-time thing or no?
  * To answer this question, need to think of review algorithm more
* Add report functionality
  * Reporting assumes immutable, site-generated cards that might be wrong
  * Not sure what makes more sense

**Nonfunctional**

* Need to think of some general schema for this sort of thing, so that it works for different inputs. This is a big looming question.



## Readings

**Functional**

- let user upload some text (file upload, copy paste)
- tokenize input
- paginate (as needed)
- color-code words based on user's understanding of them
- provide tool to look up word/phrase
- See translation/ example sentences/card info (where relevant)


**Nonfunctional**	


## Study

**Functional** 

- add algorithm for card review
  - -1.3<EF<2.5
  - 1,2,3,4 response.
  - Adjust EF accordingly
  - Adjust next time interval accordingly
  - add 'fuzz' to prevent cards from being same order
- figure out how to generate tests (probably just go with simple card review)

**Nonfunctional**

- what will this look like?
- what fields needed? To display, or otherwise



## Backend

**Mongo**

- Look at adding [schema validation](mongoosejs.com)
- Consider removing 'word ' field from exception
- For specific exceptions, remove animate/inanimate if not needed (maybe this is not worth the trouble, it's a really trivial amount of space)
- Move db, url from the routes page to the mongo, just less code and makes more sense

**Node**

- pipe output to a file or db (figure out what level of logging info to track)
- Make API input size agnostic (one or many) 




##Testing

* for each factory, come up with some specific test cases and assertions as time goes on

* figure out how to test non-factory components like filters and controllers

* Decliner, use testResults.json to figure out if declension is working

  ​

## Refactoring

- unuppercase Single/Plural, Animate/Inanimate, percolate changes throughout app

- use for each simply to push promise onto array, then use `$q.all` to wait for all the promises to resolve (for now solution not worth cost)

  ​

##Profile

**Functional**

- some sort of viewport/link to other sections?
- what view will be served to non-authenticated user?

**Nonfunctional**



##Misc.

**Nonfunctional**

- Make footer more compact, come up with nicer spacing



##Admin

* Move onto a deployment server
* Design Docs/How-to
  * [JSDoc](http://usejsdoc.org/)
* Credit the [artists](www.flaticon.com) 
  * <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
  * <div>Icons made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
* Use Grunt or [NPM](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) as a build tool
* Lint your files
  * eventually, replace `==` with `===` and also `!=` with `!==`
* Minify



## Potential Ideas

- add editing functionality to the cards
- integrate [Tatoeba](https://tatoeba.org/eng/)
- word bank!
- move to a model of every word entered going into the database.  Then we could keep track of frequency, and provide an asynchronous suggestion bank
- Total sentence constructor, with pronoun and verb placement, this can either be a different feature from decliner or future extension



##Out of Scope

* words with multiple forms of plurals
* non-declinable, non-russian names.
* currently deciding if I can handle locative case for words like год
* Singular personal pronouns? Question pronouns? Determinative?