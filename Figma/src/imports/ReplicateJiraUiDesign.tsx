import svgPaths from "./svg-j34ug4njia";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3159e300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 6.66667V9.33333" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6.66667V8" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 6.66667V10.6667" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#0747a6] relative rounded-[4px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.988px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[37.5px] not-italic text-[#101828] text-[14px] text-center top-[-0.2px] whitespace-nowrap">ProjectFlow</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[60.8px] relative shrink-0 w-[239.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pb-[0.8px] pl-[16px] relative size-full">
        <Container1 />
        <Button />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1cfa1bc0} id="Vector" stroke="var(--stroke-0, #0747A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2cfdb900} id="Vector_2" stroke="var(--stroke-0, #0747A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p17f25d40} id="Vector_3" stroke="var(--stroke-0, #0747A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p15fb5e00} id="Vector_4" stroke="var(--stroke-0, #0747A6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[63.825px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#0747a6] text-[14px] top-[-0.2px] whitespace-nowrap">Your work</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute bg-[rgba(7,71,166,0.1)] content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon1 />
      <Sidebar1 />
    </div>
  );
}

function ListItem() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3159e300} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M5.33333 6.66667V9.33333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 6.66667V8" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 6.66667V10.6667" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[48.775px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-0.2px] whitespace-nowrap">Projects</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon2 />
      <Sidebar2 />
    </div>
  );
}

function ListItem1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p36bb6c80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[36.5px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-0.2px] whitespace-nowrap">Filters</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon3 />
      <Sidebar3 />
    </div>
  );
}

function ListItem2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pff0fc00} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1d76d410} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2f091200} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39897300} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[73.412px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-0.2px] whitespace-nowrap">Dashboards</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon4 />
      <Sidebar4 />
    </div>
  );
}

function ListItem3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link3 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[38.413px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-0.2px] whitespace-nowrap">Teams</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon5 />
      <Sidebar5 />
    </div>
  );
}

function ListItem4() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link4 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p17070980} id="Vector" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 2.66667V5.33333" id="Vector_2" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 5.33333H14.6667" id="Vector_3" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M4 2.66667V5.33333" id="Vector_4" stroke="var(--stroke-0, #364153)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[31.438px]" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#364153] text-[14px] top-[-0.2px] whitespace-nowrap">Apps</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[32px] items-center left-0 pl-[10px] rounded-[4px] top-0 w-[215.2px]" data-name="Link">
      <Icon6 />
      <Sidebar6 />
    </div>
  );
}

function ListItem5() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="List Item">
      <Link5 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] h-[202px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.988px] relative shrink-0 w-[57.338px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#6a7282] text-[12px] text-center tracking-[0.3px] uppercase whitespace-nowrap">Projects</p>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[27.988px] relative shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] relative size-full">
          <Text />
          <Icon7 />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[89.363px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[45px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.2px] whitespace-nowrap">Create project</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[32px] relative rounded-[4px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[10px] relative size-full">
          <Icon8 />
          <Text1 />
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] h-[63.987px] items-start relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[239.2px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start pt-[16px] px-[12px] relative size-full">
        <List />
        <Container2 />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="bg-white h-[729.6px] relative shrink-0 w-[240px]" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-r-[0.8px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[0.8px] relative size-full">
        <Container />
        <Navigation />
      </div>
    </div>
  );
}

function Container4() {
  return <div className="flex-[1_0_0] h-0 min-h-px min-w-px" data-name="Container" />;
}

function Icon9() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#0747a6] h-[32px] left-[408px] rounded-[8px] top-[0.8px] w-[81.075px]" data-name="Button">
      <Icon9 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[54.5px] not-italic text-[12px] text-center text-white top-[8px] whitespace-nowrap">Create</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="absolute bg-[#f9fafb] h-[33.6px] left-0 rounded-[4px] top-0 w-[400px]" data-name="Text Input">
      <div className="content-stretch flex items-center overflow-clip pl-[32px] pr-[12px] py-[6px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(10,10,10,0.5)] whitespace-nowrap">Search</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute left-[10px] size-[14px] top-[9.8px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p8cdb700} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.25 12.25L9.74167 9.74167" id="Vector_2" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute h-[33.6px] left-0 top-0 w-[400px]" data-name="Container">
      <TextInput />
      <Icon10 />
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[33.6px] relative shrink-0 w-[489.075px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button3 />
        <Container6 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_920)" id="Icon">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p11f26280} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 11.3333H8.00667" id="Vector_3" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_920">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[74.66px] rounded-[4px] size-[32px] top-0" data-name="Button">
      <Icon11 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[110.66px] rounded-[4px] size-[32px] top-0" data-name="SlotClone">
      <Icon12 />
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#9810fa] flex-[1_0_0] h-[28px] min-h-px min-w-px relative rounded-[26843500px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">JD</p>
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex items-start left-[2px] overflow-clip rounded-[26843500px] size-[28px] top-[2px]" data-name="Primitive.span">
      <Text2 />
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="absolute left-[150.66px] rounded-[26843500px] size-[32px] top-0" data-name="SlotClone">
      <PrimitiveSpan />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1ce3c700} id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1a06de00} id="Vector_2" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone2() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[38.66px] rounded-[4px] size-[32px] top-0" data-name="SlotClone">
      <Icon13 />
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] h-[32px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Button4 />
        <SlotClone />
        <SlotClone1 />
        <SlotClone2 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[48px] relative shrink-0 w-[926.4px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center justify-center pb-[0.8px] relative size-full">
        <Container4 />
        <Container5 />
        <Container7 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="absolute content-stretch flex h-[31.988px] items-start left-0 top-0 w-[847.2px]" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[32px] min-h-px min-w-px not-italic relative text-[#101828] text-[24px]">For you</p>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[101.213px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#101828] text-[16px] top-[-2.2px] whitespace-nowrap">Recent spaces</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[93.138px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#4a5565] text-[14px] top-[-0.2px] whitespace-nowrap">Recommended</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white h-[33.6px] relative rounded-[4px] shrink-0 w-[74.787px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d1d5dc] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[37.8px] not-italic text-[#364153] text-[16px] text-center top-[2.6px] whitespace-nowrap">Recent</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[33.6px] relative shrink-0 w-[175.925px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text3 />
        <Button5 />
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[94.662px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[47px] not-italic text-[#0747a6] text-[14px] text-center top-[-0.2px] whitespace-nowrap">View all spaces</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[33.6px] relative shrink-0 w-[282.587px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container11 />
        <Button6 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[33.6px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">
          <Heading1 />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[24px] left-[362.78px] top-[48.8px] w-[121.638px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[61.5px] not-italic text-[#101828] text-[16px] text-center top-[-2.2px] whitespace-nowrap">No spaces found</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[20px] left-[313.63px] top-[80.8px] w-[219.95px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[110.5px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.2px] whitespace-nowrap">You have no recently viewed spaces</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#0747a6] content-stretch flex h-[32px] items-center justify-center left-[360.26px] px-[16px] py-[8px] rounded-[8px] top-[116.8px] w-[126.662px]" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">View all spaces</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white h-[197.6px] relative rounded-[4px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-[0.8px] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Heading2 />
      <Paragraph />
      <Button7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] h-[247.2px] items-start left-0 top-[63.99px] w-[847.2px]" data-name="Container">
      <Container9 />
      <Container12 />
    </div>
  );
}

function Button8() {
  return (
    <div className="h-[41.6px] relative shrink-0 w-[102.063px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#0747a6] border-b-[1.6px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[51px] not-italic text-[#0747a6] text-[14px] text-center top-[9.8px] whitespace-nowrap">Worked on</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="h-[40px] relative shrink-0 w-[78.475px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[39px] not-italic text-[#4a5565] text-[14px] text-center top-[9.8px] whitespace-nowrap">Viewed</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[#e5e7eb] content-stretch flex h-[19.988px] items-start left-[122.49px] px-[6px] py-[2px] rounded-[26843500px] top-[10px] w-[18.663px]" data-name="Text">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#364153] text-[12px] text-center whitespace-nowrap">8</p>
    </div>
  );
}

function Button10() {
  return (
    <div className="h-[40px] relative shrink-0 w-[157.15px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[65px] not-italic text-[#4a5565] text-[14px] text-center top-[9.8px] whitespace-nowrap">Assigned to me</p>
        <Text4 />
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="h-[40px] relative shrink-0 w-[77.7px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[39px] not-italic text-[#4a5565] text-[14px] text-center top-[9.8px] whitespace-nowrap">Starred</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="h-[40px] relative shrink-0 w-[75.5px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[38.5px] not-italic text-[#4a5565] text-[14px] text-center top-[9.8px] whitespace-nowrap">Boards</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[41.4px] items-center left-0 pb-[0.8px] top-[343.19px] w-[847.2px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b-[0.8px] border-solid inset-0 pointer-events-none" />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[48px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
        <g id="Icon">
          <path d={svgPaths.p190b8e00} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-[#f3f4f6] content-stretch flex items-center justify-center left-[374.8px] rounded-[26843500px] size-[96px] top-[64px]" data-name="Container">
      <Icon14 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[28px] left-[276.37px] top-[184px] w-[292.837px]" data-name="Heading 3">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[28px] left-[146.5px] not-italic text-[#101828] text-[18px] text-center top-[-1.4px] whitespace-nowrap">{`You haven't worked on anything yet`}</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[45.5px] left-[166.8px] top-[220px] w-[512px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[22.75px] left-[256.33px] not-italic text-[#4a5565] text-[14px] text-center top-[-0.4px] w-[507px]">{`In this page, you'll find your recently worked on work items. Get started by finding the space your team is working on.`}</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute bg-[#0747a6] content-stretch flex h-[32px] items-center justify-center left-[359.46px] px-[16px] py-[8px] rounded-[8px] top-[289.5px] w-[126.662px]" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">View all spaces</p>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-white border-[#e5e7eb] border-[0.8px] border-solid h-[387.1px] left-0 rounded-[4px] top-[408.59px] w-[847.2px]" data-name="Container">
      <Container15 />
      <Heading3 />
      <Paragraph1 />
      <Button13 />
    </div>
  );
}

function YourWork() {
  return (
    <div className="h-[795.688px] relative shrink-0 w-full" data-name="YourWork">
      <Heading />
      <Container8 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="bg-[#f4f5f7] flex-[1_0_0] min-h-px min-w-px relative w-[926.4px]" data-name="Main Content">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[32px] pr-[47.2px] pt-[32px] relative size-full">
          <YourWork />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] h-[729.6px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}

export default function ReplicateJiraUiDesign() {
  return (
    <div className="bg-white content-stretch flex items-start relative size-full" data-name="Replicate Jira UI Design">
      <Sidebar />
      <Container3 />
    </div>
  );
}