const rWithB = /\btext-\[#23B750\]\b/g;
const rWithoutB = /\btext-\[#23B750\](?:\b|(?=["'\s]))/g;

const text1 = 'class="text-[#23B750]"';
const text2 = 'class="text-[#23B750] foo"';

console.log('rWithB on text1 (followed by quote):', rWithB.test(text1));
rWithB.lastIndex = 0;
console.log('rWithB on text2 (followed by space):', rWithB.test(text2));
