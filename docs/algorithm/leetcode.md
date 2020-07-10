# Leetcode 面试题

面试题原链接 <https://github.com/LeetCode-OpenSource/hire>

1. **基础编程能力**  
   `题目链接`: <https://github.com/LeetCode-OpenSource/hire/blob/master/foundations_zh.md>

   `问题描述`: 假设我们在业务中有一个需求是将浏览器中的错误上报到日志中心。 在上报前，我们需要在前端先将错误的各种信息序列化为日志中心可以处理的 JSON 形式, 输入是一个 Error 对象，但是在不同的浏览器下`stack`它有着细微的区别。

   `输入`:

   ```typescript
   const error = new TypeError('Error raised');
   error.stack = `TypeError: Error raised
   at bar http://192.168.31.8:8000/c.js:2:9
   `;
   ```

   `输出`:

   ```typescript
   {
       message: 'Error raised',
       stack: [
           {
               line: 2,
               column: 9,
               filename: 'http://192.168.31.8:8000/c.js'
           }
       ]
   }
   ```

   `个人答案`：

   ```typescript
   interface IStackItem {
     line: number;
     column: number;
     filename: string;
   }

   interface ErrorMessage {
     message: string;
     stack: IStackItem[];
   }

   const reg = /^.*(https?:\/\/.+):(\d+):(\d+)$/;

   const ErrorToMessage = (error: Error): ErrorMessage => {
     const stackMsgArr = (error.stack || '').split(`
       `);
     const stack: IStackItem[] = [];
     stackMsgArr.forEach(msg => {
       if (!msg.trim()) return;
       const match = msg.trim().match(reg);
       if (!match) return;
       stack.push({
         filename: match[1],
         line: parseInt(match[2]),
         column: parseInt(match[3]),
       });
     });
     return {
       message: error.message,
       stack,
     };
   };

   export default ErrorToMessage;
   ```
