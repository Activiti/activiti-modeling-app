#!/bin/sh
updatebot push-regex -r "\s+tag: (.*)" -v $(cat VERSION) --previous-line "\s+ repository: activiti/activiti-modeling-app" charts/activiti-cloud-modeling/values.yaml
