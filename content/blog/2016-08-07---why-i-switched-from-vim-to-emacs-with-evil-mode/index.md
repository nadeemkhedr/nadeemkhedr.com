---
title: 'Why I switched from vim to emacs + evil mode'
date: '2016-08-07T05:30:57.000Z'
tags: ['vim', 'emacs', 'evil-mode']
---

## Emacs ... What ?

Without a doubt one of the best things i did for the last couple of years was learning vim, although we are programmers and we always try to find the smart way to solve dumb problems, the way we edit/navigate text (at least for me) is very dumb, using mouse to select and copy then past, type the arrow keys to navigate … my head hearts when I try to remember how it was like.

vim power in editing documents is unparalleled and it improved my productivity in so many way, that said .. why i am talking about emacs ?

### Why vim bothered me

vim is great tool for manipulating and navigating text, but its an terrible/unmaintainable**\*** software the biggest two things that bothered me was

- async feature, which vim completely lacks, if you want to do linting/fuzzy finding files you have to wait till the operation is completed, which results in an annoying freeze whenever you save file for linting or if you are finding a file huge directory using something like ctrl-p, the editor freezes till the operation is completed
- extending vim with vimscript, don’t have much to say here other than emacs elisp is better in every way, people write there plugins using TDD in emacs, that’s how cool it is.

  _\* this is the words of a lot more experienced vim people, I’ve been only using it for more than a couple of years.. but a lot more smarter people after reading the vim source code concluded that._
  _\* i know `nvim` is out there (a fork of the `vim` project that promises to solve all the `vim` issues) it has async also you can already achieve async fuzzy finding using plugins like `fzf`. `nvim` promises to introduce an new plugin architecture, until `nvim` is complete enough, I am giving emacs a try_

### Switching to emacs

I wanted to switch to emacs for 4 reasons

- async, you can do linting, IDE like features, which vim lacked
- elisp, it was appealing when i first saw someone making a game in emacs
- it can do complicated stuff, like i said people can make games in emacs, this just shows how emacs is built and how easy it is to extend it
- evil mode, a vim layer for emacs, basically you use vim power inside an awesome editor

While i was surfing the web I found this really great talk by Aaron Bieber [Evil Mode: Or, How I Learned to Stop Worrying and Love Emacs](https://www.youtube.com/watch?v=JWD1Fpdd4Pc) this completely sold me, the following week I tried emacs.
