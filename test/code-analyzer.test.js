import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
describe('The javascript parser', () => {
    simpleExpressionsTests();
    statementsTests();
});
function simpleExpressionsTests(){
    testSimpleBinaryExpression1BiggerThan0();
    testSimpleIdentifierExpressionA();
    testSimpleLiteralExpressionZero();
    testSimpleLogicalExpressionXorY();
    testSimpleMemberExpressionA0();
    testSimpleUnaryExpressionNotA();
    testSimpleUpdateExpressionIMinus();
    testSimpleUpdateExpressionWithPrefixMinusI();
}
function testSimpleBinaryExpression1BiggerThan0() {
    it('is parsing an simple binary expression 1>0', () => {
        assert.equal(
            JSON.stringify(parseCode('1>0;')),
            '[{"line":1,"type":"BinaryExpression","name":"","condition":"1 > 0","value":""}]'
        );
    });
}
function testSimpleIdentifierExpressionA() {
    it('is parsing a simple identifier expression a', () => {
        assert.equal(
            JSON.stringify(parseCode('a;')),
            '[{"line":1,"type":"Identifier","name":"a","condition":"","value":""}]'
        );
    });
}
function testSimpleLiteralExpressionZero() {
    it('is parsing a simple literal expression zero', () => {
        assert.equal(JSON.stringify(parseCode('0;')),
            '[{"line":1,"type":"Literal","name":"","condition":"","value":"0"}]'
        );
    });
}
function testSimpleLogicalExpressionXorY() {
    it('is parsing a simple logical expression x or  (||) y', () => {
        assert.equal(
            JSON.stringify(parseCode('x || y')),
            '[{"line":1,"type":"LogicalExpression","name":"","condition":"","value":"x || y"}]'
        );
    });
}
function testSimpleMemberExpressionA0() {
    it('is parsing a simle member expression a[0]', () => {
        assert.equal(
            JSON.stringify(parseCode('a[0];')),
            '[{"line":1,"type":"MemberExpression","name":"","condition":"","value":"a[0]"}]'
        );
    });
}


function testSimpleUnaryExpressionNotA() {
    it('is parsing an unary expression !a', () => {
        assert.equal(
            JSON.stringify(parseCode('!a;')),
            '[{"line":1,"type":"UnaryExpression","name":"a","condition":"","value":"!a"}]'
        );
    });
}

function testSimpleUpdateExpressionIMinus() {
    it('is parsing a simple update expression i--', () => {
        assert.equal(
            JSON.stringify(parseCode('i--;')),
            '[{"line":1,"type":"assignment expression","name":"i","condition":"","value":"i--"}]'
        );
    });
}

function testSimpleUpdateExpressionWithPrefixMinusI() {
    it('is parsing an update expression with prefix --i', () => {
        assert.equal(
            JSON.stringify(parseCode('--i;')),
            '[{"line":1,"type":"assignment expression","name":"i","condition":"","value":"--i"}]'
        );
    });
}
function statementsTests(){
    testAssignmentExpressionAToZero();
    testForLoopStatement();
    testForLoopNoVarDeclaration();
    testForLoopNoVarUpdate();
    testFunctionDeclarationNoArguments();
    testFunctionDeclarationWithArguments();
    testIfStatement();
    testIfElseifStatement();
    testIfElseStatement();
    testOnlySemicolon();
    testVariableDeclarationLetA();
    testVariableDeclarationWithValueATo5();
    testVariableDeclarationWithNegValueAtoMinus5();
    testWhileLoopStatement();

}
function testAssignmentExpressionAToZero() {
    it('is parsing an assignment expression a to zero', () => {
        assert.equal(
            JSON.stringify(parseCode('a=0;')),
            '[{"line":1,"type":"assignment expression","name":"a","condition":"","value":"0"}]'
        );
    });
}
function testForLoopStatement(){
    it('is parsing an for regular loop statement', () => {
        assert.equal(
            JSON.stringify(parseCode('for(i=0; i<100; i++){}')),
            '[{"line":1,"type":"for statement","name":"","condition":"i < 100","value":""},' +
            '{"line":1,"type":"assignment expression","name":"i","condition":"","value":"0"},' +
            '{"line":1,"type":"assignment expression","name":"i","condition":"","value":"i++"}]'
        );
    });
}
function testForLoopNoVarDeclaration() {
    it('is parsing an for loop statement without var declaration', () => {
        assert.equal(
            JSON.stringify(parseCode('function a(){\n' +
                '    for(; i<100; i++){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"a","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 100","value":""},' +
            '{"line":2,"type":"assignment expression","name":"i","condition":"","value":"i++"}]'
        );
    });
}
function testForLoopNoVarUpdate() {
    it('is parsing an for loop statement without var update', () => {
        assert.equal(
            JSON.stringify(parseCode('function a(){\n' +
                '    for(;i<100;){}\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"a","condition":"","value":""},' +
            '{"line":2,"type":"for statement","name":"","condition":"i < 100","value":""}]'
        );
    });
}

function testFunctionDeclarationNoArguments() {
    it('is parsing an function declaration without arguments a()', () => {
        assert.equal(
            JSON.stringify(parseCode('function a(){\n' +
                '    return 0;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"a","condition":"","value":""},' +
            '{"line":2,"type":"return statement","name":"","condition":"","value":"0"}]'
        );
    });
}
function testFunctionDeclarationWithArguments() {
    it('is parsing an function declaration with arguments a(b)', () => {
        assert.equal(
            JSON.stringify(parseCode('function a(b){\n' +
                '    return 0;\n' +
                '}')),
            '[{"line":1,"type":"function declaration","name":"a","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"b","condition":"","value":""},'+
            '{"line":2,"type":"return statement","name":"","condition":"","value":"0"}]'
        );
    });
}
function testIfStatement(){
    it('is parsing a regular if statement if(a)', () => {
        assert.equal(
            JSON.stringify(parseCode('if(a){}')),
            '[{"line":1,"type":"if statement","name":"","condition":"a","value":""}]'
        );
    });
}

function testIfElseifStatement() {
    it('is parsing an if and else if statement', () => {
        assert.equal(
            JSON.stringify(parseCode('if(a){}\n' +
                'else if(b){}')),
            '[{"line":1,"type":"if statement","name":"","condition":"a","value":""},' +
            '{"line":2,"type":"else if statement","name":"","condition":"b","value":""}]'
        );
    });
}
function testIfElseStatement() {
    it('is parsing an if and else statement', () => {
        assert.equal(
            JSON.stringify(parseCode('if(a){}\n' +
                'else if(b){}\n'+
                'else {let c = 5}')),
            '[{"line":1,"type":"if statement","name":"","condition":"a","value":""},' +
            '{"line":2,"type":"else if statement","name":"","condition":"b","value":""},'+
            '{"line":3,"type":"variable declaration","name":"c","condition":"","value":5}]'
        );
    });
}
function testOnlySemicolon() {
    it('is parsing a semicolon', () => {
        assert.equal(
            JSON.stringify(parseCode(';')),
            '[]'
        );
    });
}
function testVariableDeclarationLetA(){
    it('is parsing an variable declaration let a', () => {
        assert.equal(
            JSON.stringify(parseCode('let a;')),
            '[{"line":1,"type":"variable declaration","name":"a","condition":"","value":null}]'
        );
    });
}
function testVariableDeclarationWithValueATo5(){
    it('is parsing an variable declaration with value a = 5', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 5;')),
            '[{"line":1,"type":"variable declaration","name":"a","condition":"","value":5}]'
        );
    });
}

function testVariableDeclarationWithNegValueAtoMinus5(){
    it('is parsing an variable declaration with negetive value a=-5', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = -5;')),
            '[{"line":1,"type":"variable declaration","name":"a","condition":"","value":"-5"}]'
        );
    });
}
function testWhileLoopStatement() {
    it('is parsing an while loop statement', () => {
        assert.equal(
            JSON.stringify(parseCode('while(a){}')),
            '[{"line":1,"type":"while statement","name":"","condition":"a","value":""}]'
        );
    });
}
