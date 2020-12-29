---
title: 'Emacs tips and best plugins to use with evil mode'
date: '2016-08-24T13:22:14.000Z'
tags: ['emacs', 'evil-mode', 'tips-and-tricks', 'configure', 'text-editor']
---

> Note: this article is going to be continuously updated, I'll update this post the more I use emacs and find cool tips for it or find cool plugins

I won’t go in-depth for actually how to get started with emacs and every little config, I’ll just point out some small details that made it easier to get started.

## Basic Tips

- install emacs and create `~/.emacs.d/init.el` that is the equivalent to `vimrc` file
- the best way to learn how emacs works, read the emacs configs for other smart people
- Its really important to not copy the whole config files, copy bit by bit and understand what each bit does
- emacs has package manager built in
  - its more like vim `pathogen` in the sense that the packages you have are not reflected in the config itself
  - to get around that you install `use-package` if you pass it `:ensure t`, then it will install the package when emacs start (ex: `(use-package evil :ensure t)`)
  - the package manager can be extended to use multiple sources when searching for packages, you need to do something like this at the top of the config

```
(add-to-list 'package-archives '("org" . "http://orgmode.org/elpa/"))
(add-to-list 'package-archives '("melpa" . "http://melpa.org/packages/"))
(add-to-list 'package-archives '("melpa-stable" . "http://stable.melpa.org/packages/"))
```

---

## Plugin Specific Tips

### Neotree [link](https://github.com/jaypei/emacs-neotree)

neotree is the equivalent for NERDtree, here are some basic settings that I have for it

```
(use-package neotree
  :ensure t
  :config

	(evil-leader/set-key
	"m"  'neotree-toggle
	"n"  'neotree-project-dir)

  (setq projectile-switch-project-action 'neotree-projectile-action)
  (add-hook 'neotree-mode-hook
    (lambda ()
      (define-key evil-normal-state-local-map (kbd "q") 'neotree-hide)
      (define-key evil-normal-state-local-map (kbd "I") 'neotree-hidden-file-toggle)
      (define-key evil-normal-state-local-map (kbd "z") 'neotree-stretch-toggle)
      (define-key evil-normal-state-local-map (kbd "R") 'neotree-refresh)
      (define-key evil-normal-state-local-map (kbd "m") 'neotree-rename-node)
      (define-key evil-normal-state-local-map (kbd "c") 'neotree-create-node)
      (define-key evil-normal-state-local-map (kbd "d") 'neotree-delete-node)

      (define-key evil-normal-state-local-map (kbd "s") 'neotree-enter-vertical-split)
      (define-key evil-normal-state-local-map (kbd "S") 'neotree-enter-horizontal-split)

      (define-key evil-normal-state-local-map (kbd "RET") 'neotree-enter))))
```

Most of the code here is self-explanatory, it just makes it work with evil binding and added some extra keys

- `m` for move
- `d` for delete
- `c` for create
- `z` for max/min neotree window
- `I` toggle hidden files
- `R` for refresh
- `s` open in vsplit
- `S` open in split
- `<leader> m` toggle neotree
- `<leader> n` open neotree and find current file in it

> Note: also there is a line related to `projectile` (will talk later about it) which basically refreshes neotree whenever you change projects

> Note: `<leader>` is added by another package `evil-leader` (will talk about it later)

##### Extra Tip

Add the following to the config

```
(use-package find-file-in-project :ensure t)

(defun neotree-project-dir ()
  "Open NeoTree using the git root."
  (interactive)
  (let ((project-dir (ffip-project-root))
        (file-name (buffer-file-name)))
    (if project-dir
        (progn
        (neotree-dir project-dir)
        (neotree-find file-name))
    (message "Could not find git project root."))))
```

So earlier I said `<leader> n` open the current file in `neotree`, the annoying part is if the file is in sub-folder, it opens the subfolder as the root, it doesn’t work like NERDTree (the root is always the git root)

The lines added above is to do exactly that, it's using another package called `find-file-in-project` and using its functionality to always specify the git root as the root when opening any file

### company mode [link](http://company-mode.github.io/)

Company mode is a text completion framework, basically, it's the implementation of how text is autocompleted and you could provide implementation of what are the complete options using custom plugins

> Note: you will find this theme a lot in emacs plugins, often plugins are isolated enough that they are able to communicate with other data sources, this only shows how well emacs and emacs plugin are written

Check available [3rd Party Packages](https://github.com/company-mode/company-mode/wiki/Third-Party-Packages)

```
(use-package company
  :ensure t
  :config
  (global-company-mode)
  (setq company-idle-delay 0.2)
  (setq company-selection-wrap-around t)
  (define-key company-active-map [tab] 'company-complete)
  (define-key company-active-map (kbd "C-n") 'company-select-next)
  (define-key company-active-map (kbd "C-p") 'company-select-previous))
```

this is really basic, install and enable company mode globally then set idle time that user have to wait before the options appear, in our case its `0.2s `

we are also setting `company-selection-wrap-around` to true, this makes a previous/next selection in the popup cycles

lastly, we define custom mapping keys

- `c-n` and `c-p` for next and previous items
- `tab` to auto complete

### helm [link](https://github.com/emacs-helm/helm)

Helm is like `ctrl-p` a fuzzy finder for .. stuff
okay .. that’s a lie, `Helm` is so much more than that, remember what I said about `company` and how it can communicate with other data sources, Helm is a fine example of exactly that, you can plug it into almost everything in emacs, or even if you are writing a plugin, you can easily integrate it with helm

Check Kris Jenkins writing a [Spotify client](https://www.youtube.com/watch?v=XjKtkEMUYGc) for emacs and integrating it with Helm

```
(use-package helm
  :ensure t
  :config
  (helm-mode 1)
  (setq helm-autoresize-mode t)
  (setq helm-buffer-max-length 40)
  (global-set-key (kbd "M-x") #'helm-M-x)
  (define-key helm-map (kbd "S-SPC") 'helm-toggle-visible-mark)
  (define-key helm-find-files-map (kbd "C-k") 'helm-find-files-up-one-level))
```

this will install `helm` along with basic configs defining a couple of key maps

- `M-x` now uses `helm-m-x` with auto-complete instead of the built in listing
- `S-SPC` to mark multiple files
- `C-k` will go up one level when inside `helm`

We are going to use `helm` with `projectile` using `helm-projectile`

### projectile [link](https://github.com/bbatsov/projectile)

This is an awesome plugin, now in emacs there is an idea of projects, you can switch to another project, find file in a project, jump to directory and so many different things, its super useful

its simple, whenever you visit a git repo, projectile saves it in a config file, now whenever you want to change to another project, you will find the project that you have visited there

```
(use-package projectile
  :ensure t
  :defer t
  :config
  (projectile-global-mode))

```

dead simple, we are enabling projectile globally, we are going to use projectile through helm interface using `helm-projectile`

### helm-projectile [link](https://github.com/bbatsov/helm-projectile)

this is the plugin that connects projectile to use with helm, now you can find files in the project that are not ignored in `.gitignore` or switch between projects all using the `helm` interface

```
(use-package helm-projectile
  :bind (("C-S-P" . helm-projectile-switch-project)
         :map evil-normal-state-map
         ("C-p" . helm-projectile))
  :ensure t
  :config
  (evil-leader/set-key
    "ps" 'helm-projectile-ag
    "pa" 'helm-projectile-find-file-in-known-projects
  ))
```

bind the following

- `C-P` to find a file in the current project
- `C-Shit-P` to switch projects
- `<leader>ps` find phrase in current project (if you have `ag` installed)
- `<leader>pa` find file in all projects
