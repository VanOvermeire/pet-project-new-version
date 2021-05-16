#!/bin/bash

set -eo pipefail

STACKNAME="pets-example-new"

if [ $# -lt 1 ]; then
    echo "Needs a bucket!"
    echo "Usage ./setup.sh <bucket>"
    exit 1
fi

BUCKET=$1

echo "Running build"
npm run build

echo "Deploying stack"

aws cloudformation package \
--template-file infrastructure.yaml \
--s3-bucket "${BUCKET}" \
--s3-prefix backendbuilds \
--output-template-file outputSamTemplate.yaml

aws cloudformation deploy \
--template-file outputSamTemplate.yaml \
--stack-name ${STACKNAME} --capabilities CAPABILITY_IAM

echo "Removing temporary SAM file"
rm outputSamTemplate.yaml && rm -rf dist
