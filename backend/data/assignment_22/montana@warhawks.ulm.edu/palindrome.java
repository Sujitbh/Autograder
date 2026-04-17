import java.util.Scanner;

public class palindrome
{

   public boolean checkPalindrome(String s)
   {
     
      int left = 0;
      int right = s.length() - 1;
      
      while(left < right)
      {
         if(s.charAt(left) != s.charAt(right))
         {
            return false;
         }
         
         left++;
         right--;
      }
      
      return true;
   }



   public static void main(String[] args)
   {
   
   palindrome checker = new palindrome();
   
   Scanner in = new Scanner(System.in);
   System.out.print("Enter a word: ");
   String element = in.next();
      
   boolean isPalindrome = checker.checkPalindrome(element);
   System.out.println("Is your word palindrome ? "+ isPalindrome);
   
   
   }
   
}