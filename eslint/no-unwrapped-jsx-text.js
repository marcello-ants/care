'use strict'

/*
  Based on https://github.com/sayari-analytics/eslint-plugin-sayari

  That package uses ESLint 8 so I couldn't use it directly without upgrading all our ESLint packages...
  If this fix ends up sticking around, we can either upgrade out ESLint packages or fork that repo later.
/*

/***
 ***  CONSTANTS
 */

const JSX_TEXT = 'JSXText'
const JSX_ELEMENT = 'JSXElement'
const JSX_EXPRESSION_CONTAINER = 'JSXExpressionContainer'
const LITERAL = 'Literal'
const TEMPLATE_LITERAL = 'TemplateLiteral'
const CONDITIONAL_EXPRESSION = 'ConditionalExpression'
const LOGICAL_EXPRESSION = 'LogicalExpression'

const RULE_DESCRIPTION = 'JSX text that share a common parent with other elements should be wrapped by a <span> tag'

/***
 ***  UTILS
 */

 const specialCharacters = /(\n)|(\t)|(\s)|(\r)|(\f)|(\v)/

 const removeSpecialCharacters = (text) => (
   text.replace(/(\n)|(\t)|(\s)|(\r)|(\f)|(\v)|(&[a-z]+;)/gm, '')
 )
 
 const isWhitespace = (text) => (/\s/).test(text)
 
 const shouldLintExpression = (expression) => (
   expression.type === TEMPLATE_LITERAL || expression.type === CONDITIONAL_EXPRESSION || (
     expression.type === LOGICAL_EXPRESSION && (
       expression.right.type === LITERAL ||
       expression.right.type === TEMPLATE_LITERAL ||
       expression.right.type === JSX_ELEMENT
     )
   )
 )
 
 const filterSiblings = (self, children = []) => (
   children.filter(({ range, type, value, expression }) => (
     (range[0] !== self[0] && range[1] !== self[1]) && (
       type === JSX_TEXT && removeSpecialCharacters(value) ||
       type === JSX_EXPRESSION_CONTAINER && shouldLintExpression(expression) ||
       type === JSX_ELEMENT
     )
   ))
 )
 
 const jsxTextFixer = (element) => {
   let loc = {
     start: { line: undefined, column: undefined },
     end: { line: undefined, column: undefined },
   }
 
   const byLine = element.raw.split('\n')
   const numLines = byLine.length
 
   let fixed = byLine.slice()
 
   let open = false
   let close = false
 
   let index = 0
   while (index < numLines && open === false) {
     const line = byLine[index]
 
     if (removeSpecialCharacters(line)) {
       for (let i = 0; i < line.length; i += 1) {
         if (specialCharacters.test(line[i])) continue
 
         if (index === 0) {
           if (isWhitespace(line[0])) {
             fixed[index] = '&nbsp;' + line.slice(1)
           }
 
           fixed[index] = '<span>' + fixed[index]
           loc.start = element.loc.start
 
         } else {
           fixed[index] = line.slice(0, i) + '<span>' + line.slice(i)
           loc.start = { line: element.loc.start.line + index, column: i }
         }
 
         open = true
         break
       }
     }
 
     index += 1
   }
 
   index = numLines - 1
   while (index >= 0 && close === false) {
     let line = fixed[index]
 
     if (removeSpecialCharacters(line)) {
       if (isWhitespace(line[line.length - 1])) {
         line = line.slice(0, line.length - 1) + '&nbsp;'
       }
 
       fixed[index] = line + '</span>'
 
       if (numLines - 1 === index) {
         loc.end = element.loc.end
       } else {
         loc.end = {
           line: element.loc.end.line - ((numLines - 1) - index),
           column: loc.start.column + byLine[index].length
         }
       }
       close = true
     }
 
     index -= 1
   }
 
   return { loc, text: fixed.join('\n') }
 }

/***
 ***  RULE DEFINITION
 */

module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: RULE_DESCRIPTION,
      category: 'Possible Errors',
      url: 'https://github.com/facebook/react/issues/11538'
    },
    messages: {
      noUnwrappedJSX: 'No unwrapped JSX text'
    }
  },
  create: (context) => ({
    JSXExpressionContainer(element) {
      const { expression, range, parent } = element

      if (filterSiblings(range, parent.children).length === 0) {
        return null
      }

      if (expression.type === LOGICAL_EXPRESSION) {
        const { right } = expression

        if (right.type === LITERAL) {
          return (
            context.report({
              node: expression.right,
              messageId: 'noUnwrappedJSX',
              fix: (fixer) => fixer.replaceText(right, `<span>${right.value}</span>`)
            })
          )
        } else if (right.type === TEMPLATE_LITERAL) {
          return (
            context.report({
              node: element,
              messageId: 'noUnwrappedJSX',
              fix: (fixer) => ([
                fixer.insertTextBefore(element, '<span>'),
                fixer.insertTextAfter(element, '</span>')
              ])
            })
          )
        }

      } else if (expression.type === TEMPLATE_LITERAL || (
        expression.type === CONDITIONAL_EXPRESSION &&
        expression.consequent.type !== JSX_ELEMENT &&
        expression.alternate.type !== JSX_ELEMENT
      )) {
        return (
          context.report({
            node: element,
            messageId: 'noUnwrappedJSX',
            fix: (fixer) => ([
              fixer.insertTextBefore(element, '<span>'),
              fixer.insertTextAfter(element, '</span>')
            ])
          })
        )
      }

      return null
    },
    JSXText(element) {
      const { range, parent } = element

      const siblings = filterSiblings(range, parent.children)
      if (siblings.length === 0 || siblings.every(({ type }) => type === JSX_TEXT)) {
        return null
      }

      if (removeSpecialCharacters(element.value)) {
        const { loc, text } = jsxTextFixer(element)

        return context.report({
          loc,
          node: element,
          messageId: 'noUnwrappedJSX',
          fix: (fixer) => fixer.replaceText(element, text)
        })
      }
    }
  })
}