#!/bin/bash
docker exec cons-be-hokkaido bash -c 'git pull && exit' && docker restart cons-be-hokkaido
