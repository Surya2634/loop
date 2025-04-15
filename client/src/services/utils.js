export const parseCode = (code) => {
  let lines = code.split(/\n/);
  let output = [];
  output = lines.map((line) => {
    if (/\S/.test(line)) return `${line.trim()}`;
  });
  return output;
};
export const template = {
  c: `#include<stdio.h>

int main(){
  printf("Welcome to Loop");
  return 0;
}
`,
  java: `import java.util.*;
class Main {

  //Class Name Should Be Main

  public static void main(String args[]) {
    System.out.println("Welcome to Loop");
  }
}`,
};

export const emailCheck = {
  regEx: "/^[^s@]+@[^s@]+.[^s@]+$/",
};
