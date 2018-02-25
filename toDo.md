# Backlog

##Decliner

**Functional**

- some weird adjectives don't work, like numerals
- учитель Not the same as as писатель 
- double-check the `ng-blur()` is working as expected with `currGender`
- if decliner uses default ruleGroup, something is up. Let's indicate it.
- add auto-complete for prepositions input
- Consider generalizing a 'stem change' case, let's use remove like 10-15 rule groups, but adds more controller logic (might not be worth it)

**Non-functional**	

- how should components reorder here to effectively use space real estate? 
- (try to) remove borders around whiteframe for only mobile view (`flex-xs`).    

##Login

**Functional**

- make sure it requires that password and password confirmation be equal.
- increase verbosity of validity messages.
- add widget for sign-in
- level of language
- show some example words, see if they know them.

**Non-functional**

- improve spacing
- check out `flex` for different device sizes



## Card

**Functional**

**Nonfunctional**



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

**Node**

- pipe output to a file or db (figure out what level of logging info to track)
- improve `REST` endpoints, parse inputs/path urls on start, abstract such logic out of the Mongo



##Testing

* for each factory, come up with some specific test cases and assertions as time goes on

* figure out how to test non-factory components like filters and controllers

* Decliner, use testResults.json to figure out if declension is working

  ​

## Refactoring

- figure out why `POST` data needs to be in a uri string

- consolidate components

  - `loginCtrl + profileCtrl` -> `profileCtrl`
  - `auth + account` -> `account`

- unuppercase Single/Plural, Animate/Inanimate, percolate changes throughout app

- use for each simply to push promise onto array, then use `$q.all` to wait for all the promises to resolve (for now solution not worth cost)

  ​

##Home

**Functional**

- some sort of viewport/link to other sections?
- what view will be served to non-authenticated user?

**Nonfunctional**



##Misc.

**Nonfunctional**

- Make footer more compact, come up with nicer spacing



##Admin

* Buy a domain, some online mongo allocation as well
* Design Docs/How-to
* Credit the [artists](www.flaticon.com)  



## Potential Ideas

- make home and profile same view
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