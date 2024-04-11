#!/bin/bash
docker exec cons-be bash -c 'git pull && exit' && docker restart cons-be
