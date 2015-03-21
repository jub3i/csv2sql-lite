#CHECK
echo "Did you bump npm version in package.json? (Y/n):"
read answer

if [ "$answer" != "Y" ]
then
    echo "Doh! Bump the version already!"
    exit
fi

#CHECK
echo "Did you tag the git repo with the corresponding npm version?"
read answer

if [ "$answer" != "Y" ]
then
    echo "Version all the things!"
    exit
fi

#CHECK
echo "Are you running this script from the base directory? (beware relative paths!):"
read answer

if [ "$answer" != "Y" ]
then
    echo "Change to base directory dumbass!"
    exit
fi

#CLEANUP
rm -rf /tmp/csv2sql_dist/

#COPY FILES TO TMP LOCATION
TEMP_LOCATION="/tmp/csv2sql_dist"
#NOTE: copy needed files explicitly
mkdir $TEMP_LOCATION
cp ./README.md $TEMP_LOCATION
cp ./LICENSE $TEMP_LOCATION
cp ./index.js $TEMP_LOCATION
cp ./package.json $TEMP_LOCATION
mkdir $TEMP_LOCATION/test/
cp ./test/fixture.csv $TEMP_LOCATION/test/
cp ./test/index.js $TEMP_LOCATION/test/

#PUBLISH THIS BAD BOY
npm publish $TEMP_LOCATION


