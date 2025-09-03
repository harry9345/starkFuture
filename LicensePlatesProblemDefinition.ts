/**
 * You work for the DMV; you have a specific, sequential way of generating new license plate numbers:
 *
 * Each license plate number has 6 alphanumeric characters. The numbers always come before the letters.
 *
 * The first plate number is 000000, followed by 000001...
 * When you arrive at 999999, the next entry would be 00000A, Followed by 00001A...
 * When you arrive at 99999A, the next entry is 00000B, Followed by 00001B...
 * After following the pattern to 99999Z, the next in the sequence would be 0000AA...
 *
 * When 9999AA is reached, the next in the series would be 0000AB...0001AB
 * When 9999AB is reached, the next in the series would be 0000AC...0001AC
 * When 9999AZ is reached, the next in the series would be 0000BA...0001BA
 * When 9999ZZ is reached, the next in the series would be 000AAA...001AAA
 *
 * And so on untill the sequence completes with ZZZZZZ.
 *
 * So the pattern overview looks a bit like this:
 *
 * 000000
 * 000001
 * ...
 * 999999
 * 00000A
 * 00001A
 * ...
 * 99999A
 * 00000B
 * 00001B
 * ...
 * 99999Z
 * 0000AA
 * 0001AA
 * ...
 * 9999AA
 * 0000AB
 * 0001AB
 * ...
 * 9999AB
 * 0000AC
 * 0001AC
 * ...
 * 9999AZ
 * 0000BA
 * 0001BA
 * ...
 * 9999BZ
 * 0000CA
 * 0001CA
 * ...
 * 9999ZZ
 * 000AAA
 * 001AAA
 * ...
 * 999AAA
 * 000AAB
 * 001AAB
 * ...
 * 999AAZ
 * 000ABA
 * ...
 * ZZZZZZ
 *
 *
 * The goal is to write the most efficient function that can return the nth element in this sequence.
 * */

// const blocks = [
//   {
//     start: 0,
//     end: 999999,
//     digits: 6,
//     letters: 0,
//   },
//   {
//     start: 1000000,
//     end: 3599999,
//     digits: 5,
//     letters: 1,
//   },
//   {
//     start: 3600000,
//     end: 10359999,
//     digits: 4,
//     letters: 2,
//   },
//   {
//     start: 10360000,
//     end: 27935999,
//     digits: 3,
//     letters: 3,
//   },
//   {
//     start: 27936000,
//     end: 73633599,
//     digits: 2,
//     letters: 4,
//   },
//   {
//     start: 73633600,
//     end: 192447359,
//     digits: 1,
//     letters: 5,
//   },
//   {
//     start: 192447360,
//     end: 501363135,
//     digits: 0,
//     letters: 6,
//   },
// ]
