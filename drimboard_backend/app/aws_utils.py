import os
import boto3
from flask import Flask, request, jsonify
from dotenv import load_dotenv

load_dotenv()

def get_s3_credentials():
    AWS_ACCESS_KEY_ID = os.getenv("S3_AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("S3_AWS_SECRET_ACCESS_KEY")
    S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
    AWS_REGION = os.getenv("AWS_REGION")

    return_dd = {
        "AWS_ACCESS_KEY_ID": AWS_ACCESS_KEY_ID,
        "AWS_SECRET_ACCESS_KEY": AWS_SECRET_ACCESS_KEY,
        "S3_BUCKET_NAME": S3_BUCKET_NAME,
        "AWS_REGION": AWS_REGION,

    }

    return return_dd

def get_s3_client(key_id, access_key, region):
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=key_id,
        aws_secret_access_key=access_key,
        region_name=region
    )
    return s3_client

