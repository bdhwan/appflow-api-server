
const uuidv4 = require('uuid/v4');

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
}


function chunks_from_string(str, chunkSize) {
    var arr = [];
    while (str !== '') {
        arr.push(str.substring(0, chunkSize));
        str = str.substring(chunkSize);
    }
    return arr;
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


