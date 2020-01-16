const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  endpoint: new AWS.Endpoint('http://localhost:8000'),
  region: 'us-west-2',
  // what could you do to improve performance?
  convertResponseTypes: false	
});

const tableName = 'SchoolStudents';
const studentLastNameGsiName = 'studentLastNameGsi';

/**
 * The entry point into the lambda
 *
 * @param {Object} event
 * @param {string} event.schoolId
 * @param {string} event.studentId
 * @param {string} [event.studentLastName]
 */
exports.handler = async (event) => {
  // TODO use the AWS.DynamoDB.DocumentClient to write a query against the 'SchoolStudents' table and return the results.
  // The 'SchoolStudents' table key is composed of schoolId (partition key) and studentId (range key).

  // Basic query
  var query = {
  	TableName: tableName,
  	KeyConditionExpression: "schoolId = :schId",
  	ExpressionAttributeValues: {
  		":schId": event.schoolId
  	},
  	Limit: 5
  }

  //If provided range key as well
  if (event.studentId) {
  	query.KeyConditionExpression = query.KeyConditionExpression + " AND studentId = :studId";
  	query.ExpressionAttributeValues[":studId"] = event.studentId;
  }

  // TODO (extra credit) if event.studentLastName exists then query using the 'studentLastNameGsi' GSI and return the results.
  if (event.studentLastName) {
  	query = {
	  	TableName: tableName,
	  	IndexName: studentLastNameGsiName,
	  	KeyConditionExpression: "studentLastName = :stuLast",
	  	ExpressionAttributeValues: {
	  		":stuLast": event.studentLastName,
	  	},
		Limit: 5
	  }
  }

  // TODO (extra credit) limit the amount of records returned in the query to 5 and then implement the logic to return all
  //  pages of records found by the query (uncomment the test which exercises this functionality)

  // To store all data returned
  var data = []

  do {
  	// Grab query results
    var results = await dynamodb.query(query).promise();

    // Append them to our running list
    data = data.concat(results.Items)

    // Set start key for next round
  	query.ExclusiveStartKey = results.LastEvaluatedKey

  	// Continue while there is a last key. No last key indicates that we reached the last page
  } while (results.LastEvaluatedKey);

  return data;

};