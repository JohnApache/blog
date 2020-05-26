#! /bin/bash

SITE_PATH='/root/blog'

cd $SITE_PATH
git reset --hard origin/master
git clean -f
git checkout master
git pull
yarn
yarn build