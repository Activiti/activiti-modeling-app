# Note no #!/bin/sh as this should not spawn
# an extra shell. It's not the end of the world
# to have one, but clearer not to.

show_header() {
    ACTION=$1;
    TARGET=$2;

    if [ "$TARGET" == "prod" ]; then
        _PROD="\e[32m"
        PROD_="\e[0m"
    elif [ "$TARGET" == "adfdev" ]; then
        _ADF="\e[32m"
        ADF_="\e[0m"
    else
        _DEB="\e[32m"
        DEB_="\e[0m"
    fi

    echo -e "========================================================================"
    echo -e "Application is $ACTION:"
    echo -e $_DEB"<parameterless>:     in normal debug mode"$DEB_
    echo -e $_ADF"adfdev:              using local ADF components"$ADF_
    echo -e $_PROD"prod:                in production mode"$PROD_
    echo "========================================================================"
}
