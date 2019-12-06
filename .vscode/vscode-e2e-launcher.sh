specFile=$1;

findconfig() {
  if [ -f "$1" ]; then
    printf '%s\n' "${PWD%/}/$1"
  elif [ "$PWD" = / ]; then
    false
  else
    (cd .. && findconfig $1)
  fi
}

DIR=$(dirname "$specFile")
cd $DIR
configFile=`findconfig "protractor.conf.ts"`;
echo "$configFile";
