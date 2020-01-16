const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-west-2',
  // what could you do to improve performance?
  convertResponseTypes: false
});

const tableName = 'SchoolStudents';

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.schoolName
 * @param {string} event.studentId
 * @param {string} event.studentFirstName
 * @param {string} event.studentLastName
 * @param {string} event.studentGrade
 */
exports.handler = (event) => {
  // TODO validate that all expected attributes are present (assume they are all required)
  // TODO use the AWS.DynamoDB.DocumentClient to save the 'SchoolStudent' record
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).
  let validParams = ["schoolId", "schoolName", "studentId", "studentFirstName", "studentLastName", "studentGrade"]

  var doc = {}

  // Loop through our list of required params. Error on bad, add on good
  for (i = 0; i < validParams.length; i++) {
  	// If null or undefined, return error.
  	if (event[validParams[i]] == null || event[validParams[i]] == undefined) return Error("Not all params provided. Missing " + validParams[i])
  	// If it's valid, add it to the doc
  	doc[validParams[i]] = event[validParams[i]]
  }

  let submission = {
  	TableName: tableName,
  	Item: doc
  }

  dynamodb.put(submission, function(err, data){
  	if (err) {
  		console.error("Error submitting doc: " + JSON.stringify(err));
  		return Error(err);
  	}
  });

};