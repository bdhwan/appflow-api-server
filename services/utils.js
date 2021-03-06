
const uuidv4 = require('uuid/v4');
const unirest = require('unirest');


module.exports = {
    query: query,
    queryOne: queryOne,
    queryList: queryList,
    get_uuid: get_uuid,
    trim_string: trim_string,
    beginTransaction: beginTransaction,
    commit: commit,
    rollback: rollback,
    queryListTransaction: queryListTransaction,
    queryOneTransaction: queryOneTransaction,
    queryTransaction: queryTransaction,
    getResult: getResult,
    postResult: postResult,
    extractFullName: extractFullName,
    extractGitUrl: extractGitUrl,
    extractChannelName: extractChannelName,
    extractFullNameFromPush: extractFullNameFromPush,
}




function chunks_from_string(str, chunkSize) {
    var arr = [];
    while (str !== '') {
        arr.push(str.substring(0, chunkSize));
        str = str.substring(chunkSize);
    }
    return arr;
}


function getResult(url) {
    return new Promise((resolve, reject) => {
        console.log("url = " + url);
        unirest.get(url)
            .end(function (result) {
                console.log(result.status, result.headers, result.body);
                resolve(result.body);
            });
    });

}

function postResult(url, data) {
    return new Promise((resolve, reject) => {

        unirest.post(url)
            .headers({
                'Content-Type': 'multipart/form-data'
            })
            .field(data)
            .end(function (result) {
                // console.log(result.status, result.headers, result.body);
                resolve(result.body);
            });
    });
}




function extractFullName(url) {
    const list = url.replace('http://', '').replace('https://', '').replace('.git', '').split('/');
    console.log(list[list.length - 2] + '/' + list[list.length - 1])
    return list[list.length - 2] + '/' + list[list.length - 1];
}

function extractGitUrl(url) {
    const list = url.split('@');
    let targetUrl = '';
    if (list.length == 1) {
        targetUrl = url.replace('http://', '').replace('https://', '');
    }
    else {
        targetUrl = list[1];
    }
    return targetUrl;
}

function extractChannelName(data) {
    //bitbucket
    if (data.push) {
        return data.push.changes[0].new.name;
    }
    //github
    else {
        const temp = data.ref.split('/');
        return temp[temp.length - 1];
    }
}

function extractFullNameFromPush(data) {
    //bitbucket
    return data.repository.full_name;
}



//1개만 찾을 때
async function queryOne(pool, sql, params) {
    const temp = await pool.query(sql, params);
    if (temp.length == 0) {
        return null;
    }
    else {
        var resultArray = Object.values(JSON.parse(JSON.stringify(temp)))
        return resultArray[0];
    }
}

//리스트 찾을때
async function queryList(pool, sql, params) {
    const temp = await pool.query(sql, params);
    var resultArray = Object.values(JSON.parse(JSON.stringify(temp)))
    return resultArray;
}

function beginTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}

function commit(connection) {
    return new Promise((resolve, reject) => {
        connection.commit(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}


function rollback(connection) {
    return new Promise((resolve, reject) => {
        connection.rollback(function () {
            resolve(true);
        });
    });
}




//트랜젝션에서 찾을 리스트 쿼리
function queryListTransaction(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            else {
                var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
                resolve(resultArray);
            }
        });
    });
}


//트랜젝션에서 1개 찾을때
function queryOneTransaction(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            else {
                if (results.length == 0) {
                    resolve(null);
                }
                else {
                    var resultArray = Object.values(JSON.parse(JSON.stringify(results)))
                    resolve(resultArray[0]);
                }
            }
        });
    });
}


function queryTransaction(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, function (error, results, fields) {
            if (error) {
                reject(error);
            }
            else {
                resolve(results);
            }
        });
    });
}


//일반쿼리
async function query(pool, sql, params) {
    const temp = await pool.query(sql, params);
    // pool.end();
    return temp;
}




function get_uuid(max = 50) {
    const temp = uuidv4().replace(/-/g, '');
    return chunks_from_string(temp, max)[0];
}

function trim_string(str, max = 100) {
    return chunks_from_string(str, max)[0];
}


