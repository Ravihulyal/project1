import java.util.Scanner;

interface IntStack {
    void push(int item);

    int pop();

}

// Fixed stack using array of fixed size
class FixedStack implements IntStack {
    private int[] stack;
    private int top;

    FixedStack(int size) {
        stack = new int[size];
        top = -1;
    }

    public void push(int item) {
        if (top == stack.length - 1) {
            System.out.println("FixedStack Overflow! Cannot push " + item);
        } else {
            stack[++top] = item;
            System.out.println("Pushed " + item + " into FixedStack");
        }
    }

    public int pop() {
        if (top == -1) {
            System.out.println("FixedStack Underflow!");
            return -1;
        } else {
            return stack[top--];
        }
    }

}

// Dynamic stack using java.util.ArrayList (grows automatically)
class DynamicStack implements IntStack {
    private int[] stack;
    private int top;

    DynamicStack(int initialSize) {
        stack = new int[initialSize];
        top = -1;
    }

    private void resize() {
        int[] newStack = new int[stack.length * 2];
        System.arraycopy(stack, 0, newStack, 0, stack.length);
        stack = newStack;
        System.out.println("DynamicStack resized to capacity: " + stack.length);
    }

    public void push(int item) {
        if (top == stack.length - 1) {
            resize();
        }
        stack[++top] = item;
        System.out.println("Pushed " + item + " into DynamicStack");
    }

    public int pop() {
        if (top == -1) {
            System.out.println("DynamicStack Underflow!");
            return -1;
        } else {
            return stack[top--];
        }
    }

    public boolean isEmpty() {
        return top == -1;
    }
}

public class Q1StackDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        IntStack stack = null;

        System.out.println("Choose Stack Type:");
        System.out.println("1. Fixed Stack");
        System.out.println("2. Dynamic Stack");
        int choice = sc.nextInt();

        System.out.print("Enter initial size of stack: ");
        int size = sc.nextInt();

        if (choice == 1) {
            stack = new FixedStack(size);
        } else {
            stack = new DynamicStack(size);
        }

        while (true) {
            System.out.println("\n1. Push");
            System.out.println("2. Pop");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");
            int ch = sc.nextInt();

            switch (ch) {
                case 1:
                    System.out.print("Enter element to push: ");
                    int item = sc.nextInt();
                    stack.push(item);
                    break;
                case 2:
                    int popped = stack.pop();
                    if (popped != -1)
                        System.out.println("Popped: " + popped);
                    break;
                case 3:
                    System.out.println("Exiting...");
                    sc.close();
                    return;
                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}